const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');

app.use(cors());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ reply: 'No file uploaded' });
    }

    // Example: basic file type detection & reply
    const ext = path.extname(file.originalname).toLowerCase();

    let reply = '';
    if (ext === '.txt') {
      const content = fs.readFileSync(file.path, 'utf-8');
      // Process file content here with AI (or dummy response)
      reply = `Received a text file. Content preview: ${content.slice(0, 200)}...`;
    } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      reply = 'Received an image file. (You can add OCR/image AI processing here)';
    } else {
      reply = `Received a ${ext} file. (Unsupported preview, but file accepted.)`;
    }

    // Cleanup uploaded file (optional)
    fs.unlinkSync(file.path);

    res.json({ reply });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ reply: 'Error processing file.' });
  }
});

app.listen(3001, () => console.log('Server running on port 3001'));
