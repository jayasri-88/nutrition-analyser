import guidelines from './guidelines.js'; // use ES import

function analyzeNutrition(nutritionData, userProfile) {
    const { gender, age } = userProfile;
    const ageGroup = "19-30";

    const limits = guidelines[gender]?.[ageGroup];
    if (!limits) {
        return { error: "Unsupported user profile" };
    }

    const result = {};
    let unhealthyCount = 0;
    let total = 0;

    for (let nutrient in limits) {
        const recommended = limits[nutrient];
        const actual = parseFloat(
            String(nutritionData[nutrient] || "0").replace(/[^\d.]/g, " ")
        ) || 0;

        let status = "Good";
        if (actual > recommended) {
            status = "High";
            unhealthyCount++;
        }
        result[nutrient] = { actual, recommended, status };
        total++;
    }

    const unhealthyRatio = unhealthyCount / total;
    let rating = "Healthy";
    if (unhealthyRatio > 0.5) {
        rating = "Unhealthy";
    } else if (unhealthyRatio > 0.2) {
        rating = "Moderate";
    }

    return {
        rating,
        analysis: result
    };
}

export default analyzeNutrition;
