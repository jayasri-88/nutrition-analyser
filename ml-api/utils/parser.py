import re

def parse_nutrition_text(text):
    nutrients = {
        "Calories": r"Calories[\s:.\-]*([\d.]+)",
        "Total Fat": r"Total\s*Fat[\s:.\-]*([\d.]+)\s*(g|mg)?",
        "Saturated Fat": r"Saturated\s*Fat[\s:.\-]*([\d.]+)\s*(g|mg)?",
        "Trans Fat": r"Trans\s*Fat[\s:.\-]*([\d.]+)\s*(g|mg)?",
        "Cholesterol": r"Cholesterol[\s:.\-]*([\d.]+)\s*(mg)?",
        "Sodium": r"Sodium[\s:.\-]*([\d.]+)\s*(mg)?",
        "Total Carbohydrate": r"Total\s*Carbohydrate[\s:.\-]*([\d.]+)\s*(g|mg)?",
        "Sugars": r"Sugars[\s:.\-]*([\d.]+)\s*(g|mg)?",
        "Protein": r"Protein[\s:.\-]*([\d.]+)\s*(g|mg)?",
    }
    result = {}
    for key, pattern in nutrients.items():
        match = re.search(pattern, text, re.IGNORECASE)
        result[key] = match.group(1) if match else None
    return result