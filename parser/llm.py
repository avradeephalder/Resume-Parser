import requests
import json
import re
import os

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/generate")
MODEL_NAME = os.getenv("OLLAMA_MODEL", "llama3.1:8b")

COMPREHENSIVE_PROMPT = """You are an expert resume parser. Extract ALL information from this resume and return ONLY valid JSON.

Resume Text:
{resume_text}

Return JSON with this EXACT structure:
{{
  "basics": {{
    "name": "full name",
    "email": "email@example.com",
    "phone": "+1234567890",
    "location": "City, State",
    "website": "portfolio URL or null",
    "summary": "professional summary or null",
    "profiles": [
      {{"network": "LinkedIn", "url": "linkedin.com/in/username"}},
      {{"network": "GitHub", "url": "github.com/username"}}
    ]
  }},
  "work": [
    {{
      "position": "Job Title",
      "name": "Company Name",
      "location": "City",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or Present",
      "highlights": ["achievement 1", "achievement 2"]
    }}
  ],
  "education": [
    {{
      "institution": "School Name",
      "area": "Field of Study",
      "studyType": "Degree Type",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD",
      "score": "GPA: 3.8/4.0"
    }}
  ],
  "skills": [
    {{
      "name": "Technical Skills",
      "keywords": ["Java", "Python", "React"]
    }}
  ],
  "projects": [
    {{
      "name": "Project Name",
      "description": "Brief description",
      "highlights": ["feature 1", "feature 2"],
      "keywords": ["React", "Node.js"]
    }}
  ],
  "languages": [
    {{"language": "English", "fluency": "Fluent"}}
  ],
  "certificates": [
    {{
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "YYYY-MM-DD"
    }}
  ],
  "awards": [
    {{
      "title": "Award Name",
      "date": "YYYY-MM-DD",
      "awarder": "Organization"
    }}
  ],
  "volunteer": [
    {{
      "organization": "Org Name",
      "position": "Role",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD"
    }}
  ]
}}

CRITICAL: Return ONLY the JSON object, no markdown, no explanations."""

def _extract_json_block(text: str) -> str:
    """Extract JSON from response text"""
    # remove any triple backtick code fences (e.g.,  or json)
    text = re.sub(r'```', '', text)
    m = re.search(r'\{.*\}', text, re.DOTALL)
    return m.group(0) if m else text

def extract_with_ollama(resume_text: str) -> dict:
    """Extract resume data using Ollama Llama 3.1 8B"""
    prompt = COMPREHENSIVE_PROMPT.format(resume_text=resume_text[:4000])
    
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "temperature": 0.1,
        "format": "json"
    }
    
    try:
        print(f"[INFO] Sending to Ollama ({MODEL_NAME})...")
        r = requests.post(OLLAMA_URL, json=payload, timeout=180)
        
        if r.status_code != 200:
            raise RuntimeError(f"Ollama error {r.status_code}: {r.text}")
        
        data = r.json()
        raw = data.get("response", "")
        json_str = _extract_json_block(raw).strip()
        
        result = json.loads(json_str)
        
        # Ensure all required fields exist
        result.setdefault("basics", {})
        result.setdefault("work", [])
        result.setdefault("education", [])
        result.setdefault("skills", [])
        result.setdefault("projects", [])
        result.setdefault("languages", [])
        result.setdefault("certificates", [])
        result.setdefault("awards", [])
        result.setdefault("volunteer", [])
        
        print(f"[INFO] Successfully parsed with Llama 3.1 8B")
        return result
    
    except json.JSONDecodeError as e:
        print(f"[ERROR] Failed to parse JSON: {e}")
        print(f"[DEBUG] Raw response: {raw[:500]}")
        raise RuntimeError(f"Failed to parse JSON from Ollama: {e}")
    except Exception as e:
        print(f"[ERROR] Ollama extraction failed: {str(e)}")
        raise RuntimeError(f"Ollama extraction failed: {str(e)}")