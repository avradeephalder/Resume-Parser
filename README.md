# 🎯 AI Resume Parser

AI-powered resume parser using Llama 3.1 8B and OpenAI. Extract structured data from PDF resumes including contact info, skills, experience, education, projects, certifications, and more. Built with React, FastAPI, Express, and Ollama.

![License](https://img.shields.io/badge/License-Apache%202.0-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18+-61dafb)

---

## ✨ Key Features

- 📄 **PDF Resume Parsing:** Upload PDF resumes and extract structured JSON data
- 📊 **Comprehensive Extraction:** Contact info, skills, work experience, education, projects, certifications, languages, awards, and volunteer work
- ⚡ **Real-time Processing:** Fast parsing with animated loading states
- 📋 **Structured Output:** Clean JSON format following resume schema standards
- 🎨 **Modern UI:** Beautiful gradient design with smooth animations
- 🔒 **Privacy-First:** Local AI option (Ollama) for sensitive data
- 🌐 **Full-Stack:** Complete solution with frontend, backend, and AI parser

---

## 📚 Tech Stack

### Frontend
- **React** with Vite
- **Styled Components**
- Modern animations and transitions
- Responsive design

### Backend (Express)
- **Node.js** + **Express.js**
- RESTful API
- File upload handling
- Proxy to FastAPI parser

### Parser (FastAPI)
- **Python** + **FastAPI**
- **PyMuPDF** for PDF text extraction
- **Ollama** (Llama 3.1 8B) for local AI parsing
- Structured JSON output

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)
- Ollama (for local AI mode)

### 1. Clone the Repository

```
git clone https://github.com/avradeephalder/Resume-Parser.git
cd Resume-Parser
```

### 2. Parser Setup (FastAPI)

```
cd parser
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux

pip install -r requirements.txt
```

**Create `.env` file in `parser/` folder:**

```
# For Ollama mode (default)
OLLAMA_URL=http://127.0.0.1:11434/api/generate
OLLAMA_MODEL=llama3.1:8b
```

**Start the parser:**

```
uvicorn app:app --reload --port 8000
```

Runs on **http://127.0.0.1:8000**

### 3. Backend Setup (Express)

```
cd ../server
npm install
```

**Start the backend:**

```
npm run dev
```

Runs on **http://localhost:5000**

### 4. Frontend Setup (React)

```
cd ../frontend
npm install
```

**Start the frontend:**

```
npm run dev
```

Runs on **http://localhost:5173**

---

## 🖥️ Usage

1. **Open the app** at http://localhost:5173
2. **Upload a PDF resume** via drag-and-drop or file browser
3. **Click "Analyze Resume with AI"**
4. **View extracted data** in organized cards:
   - Contact Information
   - Core Skills
   - Professional Experience
   - Education
   - Projects
   - Certifications
   - Languages
   - Awards & Honors
   - Volunteer Work
5. **Parse another resume** or export the data

---

## 🏗️ Project Structure

```
Resume-Parser/
│
├── frontend/                    # React + Vite
│   ├── src/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   ├── Home.jsx            # Main UI component
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── public/
│   ├── .gitignore
│   ├── package.json
│   └── vite.config.js
│
├── server/                      # Express.js backend
│   ├── routes/
│   │   └── resume.js           # Resume upload routes
│   ├── .env
│   ├── .gitignore
│   ├── server.js
│   └── package.json
│
├── parser/                      # FastAPI + AI parser
│   ├── .venv/
│   ├── app.py                  # FastAPI main app
│   ├── extract.py              # PDF text extraction
│   ├── llm.py                  # Ollama integration
│   ├── .env
│   ├── .gitignore
│   └── requirements.txt
│
├── .gitignore                   # Root gitignore
├── LICENSE                      # Apache 2.0
└── README.md
```

---

## 🔑 Environment Variables

### Parser (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `OLLAMA_URL` | Ollama API endpoint | No (default: http://127.0.0.1:11434) |
| `OLLAMA_MODEL` | Ollama model name | No (default: llama3.1:8b) |

### Server (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | No (default: 5000) |
| `PARSER_URL` | FastAPI parser URL | No (default: http://127.0.0.1:8000) |

---

## 🌟 Key Features Explained

### PDF Text Extraction
Uses **PyMuPDF** to extract clean text from PDF resumes while preserving structure and formatting.

### Dual AI Modes

**Ollama (Llama 3.1 8B):**
- 100% local and private
- No API costs
- GPU-accelerated (if available)
- Best for sensitive data

### Structured JSON Output
Follows **JSON Resume** schema with comprehensive field extraction including nested objects for work history, education, projects, and more.

### Modern React UI
Built with styled-components featuring gradient backgrounds, smooth animations, and responsive cards for displaying parsed data.

---

## 🛠️ Development

### Install Ollama (for local AI)

**Windows:**
1. Download from https://ollama.com
2. Install and restart
3. Pull Llama 3.1 8B:

```
ollama pull llama3.1:8b
```

**Test it works:**

```
ollama run llama3.1:8b "Say hello"
```

### Running the Application

**All services together:**

```
# Terminal 1 - Parser
cd parser
.venv\Scripts\activate
uvicorn app:app --reload --port 8000

# Terminal 2 - Backend
cd server
npm run dev

# Terminal 3 - Frontend
cd frontend
npm run dev
```

### Building for Production

**Frontend:**

```
cd frontend
npm run build
```

Output in `frontend/dist/`

---

## 📝 API Documentation

### POST `/api/resumes/upload`

Upload and parse a PDF resume.

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Body:** `file` (PDF file)

**Response:**

```
{
  "basics": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, NY",
    "website": "https://johndoe.com",
    "summary": "Experienced software engineer...",
    "profiles": [
      {
        "network": "LinkedIn",
        "url": "https://linkedin.com/in/johndoe"
      }
    ]
  },
  "work": [...],
  "education": [...],
  "skills": [...],
  "projects": [...],
  "certificates": [...],
  "languages": [...],
  "awards": [...],
  "volunteer": [...]
}
```

### GET `/health`

Check parser service health.

**Response:**

```
{
  "status": "Parser running with Ollama Llama 3.1 8B"
}
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **Apache License 2.0** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Avradeep Halder**

- LinkedIn: [linkedin.com/in/avradeephalder](https://www.linkedin.com/in/avradeephalder/)
- GitHub: [@avradeephalder](https://github.com/avradeephalder)

---

## 🙏 Acknowledgments

- [Ollama](https://ollama.ai/) for local LLM inference
- [PyMuPDF](https://pymupdf.readthedocs.io/) for PDF processing
- [FastAPI](https://fastapi.tiangolo.com/) for high-performance Python API
- [React](https://react.dev/) and [Vite](https://vitejs.dev/) for modern frontend development

---

## 📧 Contact

For questions or support, please [open an issue](https://github.com/avradeephalder/Resume-Parser/issues) or contact me via LinkedIn.

---

**⭐ If you find this project helpful, please give it a star!**
```

***

## To Add This README:

```bash
cd D:\PROJECT\ResumeParser

# Create README.md with the content above
# Then:

git add README.md
git commit -m "docs: add comprehensive README with installation and usage guides"
git push
```

Your GitHub repo now has a **professional, detailed README** matching your project structure! 🚀✨
