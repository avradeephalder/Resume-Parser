def to_json_resume(text: str, ents: list) -> dict:
    """Convert extracted entities to full JSON Resume format"""
    data = {
        "basics": {
            "name": None,
            "email": None,
            "phone": None,
            "location": None,
            "website": None,
            "summary": None,
            "profiles": []
        },
        "work": [],
        "education": [],
        "skills": [],
        "projects": [],
        "languages": [],
        "certificates": [],
        "awards": [],
        "volunteer": []
    }
    
    tech_skills = []
    soft_skills = []
    
    # Process entities
    for val, label in ents:
        # Contact Info
        if label == "PERSON" and not data["basics"]["name"]:
            data["basics"]["name"] = val
        elif label == "EMAIL" and not data["basics"]["email"]:
            data["basics"]["email"] = val
        elif label == "PHONE" and not data["basics"]["phone"]:
            data["basics"]["phone"] = val
        elif label in ("GPE", "LOC") and not data["basics"]["location"]:
            data["basics"]["location"] = val
        elif label == "WEBSITE" and not data["basics"]["website"]:
            data["basics"]["website"] = val
        
        # Social Profiles
        elif label == "GITHUB":
            data["basics"]["profiles"].append({"network": "GitHub", "url": val})
        elif label == "LINKEDIN":
            data["basics"]["profiles"].append({"network": "LinkedIn", "url": val})
        
        # Skills
        elif label == "TECH_SKILL" and val not in tech_skills:
            tech_skills.append(val)
        elif label == "SOFT_SKILL" and val not in soft_skills:
            soft_skills.append(val)
        
        # Work Experience (Organizations)
        elif label == "ORG":
            if not any(w.get("name") == val for w in data["work"]):
                data["work"].append({
                    "position": None,
                    "name": val,
                    "location": None,
                    "startDate": None,
                    "endDate": None,
                    "highlights": []
                })
        
        # Education (GPAs)
        elif label == "GPA":
            if data["education"]:
                data["education"][-1]["score"] = val
    
    # Group skills by category
    if tech_skills:
        data["skills"].append({
            "name": "Technical Skills",
            "keywords": tech_skills
        })
    if soft_skills:
        data["skills"].append({
            "name": "Soft Skills",
            "keywords": soft_skills
        })
    
    return data
