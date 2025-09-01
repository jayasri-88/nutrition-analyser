import express from 'express';
import analyzeNutrition from '../../ml-api/utils/analyzeNutrition.js'; 

const router = express.Router(); 

router.post('/analyze', (req, res) => {
  const { nutritionData, user } = req.body;

  if (!nutritionData || !user) {
    return res.status(400).json({ error: "Missing data or user info" });
  }

  const result = analyzeNutrition(nutritionData, user);
  res.json(result);
});

export default router; 
