import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import resumeRouter from "./routes/resume.js"

dotenv.config()
const app = express()

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Enable CORS for all origins (for development only; restrict in production)
app.use(cors({
  origin: "http://localhost:5173", // Your Vite frontend
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ============================================================================
// ROUTES
// ============================================================================

app.use("/api/resumes", resumeRouter)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "Server is running" })
})

// ============================================================================
// START SERVER
// ============================================================================

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`)
})
