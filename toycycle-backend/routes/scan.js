const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const imageData = {
      inlineData: {
        data: req.file.buffer.toString('base64'),
        mimeType: req.file.mimetype
      }
    };
    const prompt = `Identify this toy. Respond in JSON only, no markdown:
{
  "name": "toy name",
  "brand": "brand or unknown",
  "category": "category (e.g. puzzle, doll, vehicle)",
  "age_range": "e.g. 3-6",
  "description": "1 sentence description"
}`;
    const result = await model.generateContent([prompt, imageData]);
    const text = result.response.text();
    const json = JSON.parse(text);
    res.json({ success: true, data: json });
  } catch (err) {
    console.error('SCAN ERROR:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;