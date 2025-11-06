import re
import spacy
from typing import List, Tuple

try:
    nlp = spacy.load("en_core_web_sm")
except OSError:
    nlp = None

# Regex patterns
EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b")
PHONE_RE = re.compile(r"(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}")
GITHUB_RE = re.compile(r"github\.com/[\w\-]+", re.IGNORECASE)
LINKEDIN_RE = re.compile(r"linkedin\.com/in/[\w\-]+", re.IGNORECASE)
WEBSITE_RE = re.compile(r"(?:https?://)?(?:www\.)?[\w\-]+\.\w{2,}(?:/[\w\-]*)*", re.IGNORECASE)
GPA_RE = re.compile(r"(?:GPA|CGPA):\s*(\d+\.?\d*)\s*(?:/\s*(\d+\.?\d*))?", re.IGNORECASE)

# Comprehensive skill bank
SKILL_BANK = {
    # Programming Languages
    "python", "java", "javascript", "typescript", "c++", "c#", "php", "ruby", "go", 
    "rust", "swift", "kotlin", "scala", "r", "matlab", "perl", "shell", "bash",
    
    # Web Technologies
    "html", "css", "react", "vue", "angular", "node.js", "nodejs", "express", 
    "next.js", "nextjs", "nuxt", "svelte", "jquery", "bootstrap", "tailwind",
    "sass", "scss", "webpack", "vite", "redux", "graphql",
    
    # Backend/Frameworks
    "django", "flask", "fastapi", "spring", "spring boot", "hibernate", 
    ".net", "asp.net", "laravel", "rails", "ruby on rails",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", 
    "cassandra", "dynamodb", "oracle", "sqlite", "mariadb",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "jenkins", "ci/cd",
    "terraform", "ansible", "github actions", "gitlab", "circleci",
    
    # Data Science/ML
    "machine learning", "deep learning", "tensorflow", "pytorch", "keras",
    "scikit-learn", "pandas", "numpy", "matplotlib", "seaborn", "jupyter",
    "data analysis", "data science", "nlp", "computer vision",
    
    # Tools & Others
    "git", "github", "gitlab", "jira", "confluence", "postman", "linux",
    "unix", "windows", "agile", "scrum", "microservices", "rest api",
    "soap", "kafka", "rabbitmq", "nginx", "apache"
}

# Soft skills
SOFT_SKILLS = {
    "leadership", "communication", "teamwork", "problem solving", "time management",
    "project management", "critical thinking", "adaptability", "creativity",
    "public speaking", "presentation", "analytical", "decision making"
}

def extract_entities_spacy(text: str) -> List[Tuple[str, str]]:
    """Extract entities using spaCy NER + regex"""
    ents = []
    
    # spaCy NER
    if nlp:
        doc = nlp(text)
        for e in doc.ents:
            ents.append((e.text.strip(), e.label_))
    
    # Email
    for email in EMAIL_RE.findall(text):
        ents.append((email, "EMAIL"))
    
    # Phone
    for phone in PHONE_RE.findall(text):
        phone_str = ''.join(phone).strip()
        if phone_str:
            ents.append((phone_str, "PHONE"))
    
    # GitHub
    for github in GITHUB_RE.findall(text):
        ents.append((f"https://{github}", "GITHUB"))
    
    # LinkedIn
    for linkedin in LINKEDIN_RE.findall(text):
        ents.append((f"https://{linkedin}", "LINKEDIN"))
    
    # Website
    for website in WEBSITE_RE.findall(text):
        if 'linkedin' not in website.lower() and 'github' not in website.lower():
            ents.append((website, "WEBSITE"))
    
    # GPA/CGPA
    for gpa_match in GPA_RE.finditer(text):
        ents.append((gpa_match.group(0), "GPA"))
    
    # Technical Skills
    text_lower = text.lower()
    for skill in SKILL_BANK:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            display_name = skill.title() if '.' not in skill else skill
            ents.append((display_name, "TECH_SKILL"))
    
    # Soft Skills
    for skill in SOFT_SKILLS:
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower, re.IGNORECASE):
            ents.append((skill.title(), "SOFT_SKILL"))
    
    return ents
