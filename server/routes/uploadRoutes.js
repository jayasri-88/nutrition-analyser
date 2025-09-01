import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import axios from 'axios';

const router = express.Router();

// In-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/', upload.single('file'), async (req, res) => {
  const { age, gender } = req.body;
  const file = req.file;

  // Check for required inputs
  if (!file || !age || !gender) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Step 1: Log upload info
    console.log('📥 File received:', file.originalname);
    console.log('👤 Age:', age, '| Gender:', gender);

    // Step 2: OCR processing using Tesseract
    const result = await Tesseract.recognize(file.buffer, 'eng');
    console.log('✅ OCR complete');

    const extractedText = result.data.text;
    console.log('📝 Extracted OCR Text:', extractedText);

    // Step 3: Send to ML server
    console.log('📡 Sending request to ML server...');
    const mlresponse = await axios.post('http://localhost:8000/analyze', {
      text: extractedText,
      age,
      gender
    });
    console.log('✅ ML response received:', mlresponse.data);

    // Step 4: Return success response
    res.json({
      message: 'File processed and analyzed successfully!',
      extractedText,
      analysis: mlresponse.data
    });

  } catch (error) {
    console.error('❌ Error during processing:', error.message);

    // Optional: Show details if ML server fails
    if (error.response) {
      console.error('🔴 ML Server Error:', error.response.data);
    }

    // Optional fallback response if ML server is down
    // res.json({
    //   message: 'File processed (no ML)',
    //   extractedText,
    //   analysis: {
    //     score: 75,
    //     age,
    //     gender
    //   }
    // });

    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
