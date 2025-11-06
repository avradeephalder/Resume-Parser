import express from "express"
import multer from "multer"

const upload = multer({ storage: multer.memoryStorage() })
const router = express.Router()

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    // Validate file exists
    if (!req.file) {
      return res.status(400).json({ detail: "No file uploaded" })
    }

    const parserUrl = process.env.PARSER_URL || "http://localhost:8000"
    const form = new FormData()
    form.append("file", new Blob([req.file.buffer]), req.file.originalname)

    console.log(`Forwarding file to parser: ${parserUrl}/parse`)

    const r = await fetch(`${parserUrl}/parse`, {
      method: "POST",
      body: form
    })

    // Log response status
    console.log(`Parser response status: ${r.status}`)

    // Check if response is OK
    if (!r.ok) {
      const text = await r.text()
      console.error(`Parser error response: ${text}`)
      return res.status(r.status).json({ detail: `Parser error: ${text}` })
    }

    // Parse response as JSON
    const json = await r.json()
    console.log(`Parser success, returning data`)
    
    // Return the parsed data to frontend
    res.status(200).json(json)
  } catch (e) {
    console.error("Upload error:", e.message)
    res.status(500).json({ detail: `Server error: ${e.message}` })
  }
})

export default router
