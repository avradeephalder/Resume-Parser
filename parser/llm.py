import json
import re
import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not found in .env file")

COMPREHENSIVE_PROMPT = """You are an expert resume parser. Extract ALL information from this resume and return ONLY valid JSON.

Resume Text:
{resume_text}

Return JSON with this EXACT structure (include all sections, use null for missing data):
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
    }},
    {{
      "name": "Soft Skills",
      "keywords": ["Leadership", "Communication"]
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
    {{"language": "English", "fluency": "Fluent"}},
    {{"language": "Spanish", "fluency": "Intermediate"}}
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

CRITICAL RULES:
1. Return ONLY the JSON object
2. No markdown, no code blocks, no explanations
3. Extract ALL information accurately from the resume
4. Use null for missing values, not empty strings
5. Parse dates in YYYY-MM-DD format where possible
6. Group skills into categories (Technical, Soft, etc.)
7. Extract ALL projects with their tech stacks"""


def _extract_json_block(text: str) -> str:
    """Extract JSON from response text, removing markdown if present"""
    text = re.sub(r'```')
    text = re.sub(r'```\s*', '', text)
    
    m = re.search(r'\{.*\}', text, re.DOTALL)
    return m.group(0) if m else text


def extract_with_openai(resume_text: str) -> dict:
    """Extract resume data using OpenAI GPT-3.5-turbo"""
    
    client = OpenAI(api_key=OPENAI_API_KEY)
    
    # Limit text to 8000 chars (GPT-3.5 context window)
    prompt = COMPREHENSIVE_PROMPT.format(resume_text=resume_text[:8000])
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert resume parser that returns structured JSON data."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.0,
            max_tokens=2500
        )
        
        raw = response.choices[0].message.content
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
        
        return result
    
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse JSON from OpenAI: {e}\nRaw response: {raw[:500]}")
    except Exception as e:
        raise RuntimeError(f"OpenAI API error: {str(e)}")
