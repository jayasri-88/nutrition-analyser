import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from utils.parser import parse_nutrition_text

app = Flask(__name__)
CORS(app)

def safe_float(val):
    try:
        return float(val)
    except (TypeError, ValueError):
        return None

def calculate_health_score(nutrients, age, gender):
    score = 100
    sugar_limit = 10
    sodium_limit = 150
    fat_limit = 10
    calorie_min = 100
    calorie_max = 300
    if age and age < 18:
        sugar_limit = 8
        sodium_limit = 120
    if gender and gender.lower() == "female":
        fat_limit = 8

    cal = safe_float(nutrients.get("Calories"))
    if cal is not None:
        if cal < calorie_min or cal > calorie_max:
            score -= 10
    sugar = safe_float(nutrients.get("Sugars"))
    if sugar is not None and sugar > sugar_limit:
        score -= 15
    fat = safe_float(nutrients.get("Total Fat"))
    if fat is not None and fat > fat_limit:
        score -= 10
    sodium = safe_float(nutrients.get("Sodium"))
    if sodium is not None and sodium > sodium_limit:
        score -= 10
    protein = safe_float(nutrients.get("Protein"))
    if protein is not None and protein >= 5:
        score += 5
    score = max(0, min(100, score))
    return score

@app.route('/')
def home():
    return "ML API is running!"

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        print(f"\u2705 Received data in Flask: {data}")
        text = data.get('text')
        age = data.get('age')
        gender = data.get('gender')
        if not text:
            return jsonify({"error": "No OCR text provided"}), 400
        try:
            age = int(age)
        except (TypeError, ValueError):
            age = None
        parsed_nutrients = parse_nutrition_text(text)
        health_score = calculate_health_score(parsed_nutrients, age, gender)
        if health_score >= 80:
            rating = "Healthy"
        elif health_score >= 50:
            rating = "Moderate"
        else:
            rating = "Unhealthy"
        return jsonify({
            'message': "Analysis done",
            'parsed_nutrients': parsed_nutrients,
            'score': health_score,
            'rating': rating,
            'age': age,
            'gender': gender
        })
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True, port=8000)
