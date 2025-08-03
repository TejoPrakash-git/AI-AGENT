const express = require('express');
const multer = require('multer');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const pdfParse = require('pdf-parse');
const webAutomator = require('./tools/web_automator');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ reply: 'No file uploaded' });
    }

    // File type detection & processing
    const ext = path.extname(file.originalname).toLowerCase();

    let reply = '';
    if (ext === '.txt') {
      const content = fs.readFileSync(file.path, 'utf-8');
      // Process text file content
      reply = `I've analyzed your text file. Here's a summary:\n\nContent preview: ${content.slice(0, 200)}${content.length > 200 ? '...' : ''}\n\nThe file contains ${content.length} characters and approximately ${content.split(/\s+/).length} words.`;
    } else if (ext === '.pdf') {
      // Process PDF file
      try {
        const dataBuffer = fs.readFileSync(file.path);
        const pdfData = await pdfParse(dataBuffer);
        reply = `I've analyzed your PDF file "${file.originalname}".\n\nTitle: ${pdfData.info?.Title || 'Untitled'}\nPages: ${pdfData.numpages}\nContent preview: ${pdfData.text.slice(0, 200)}${pdfData.text.length > 200 ? '...' : ''}`;
      } catch (pdfError) {
        console.error('PDF parsing error:', pdfError);
        reply = `I received your PDF file but had trouble parsing it. Error: ${pdfError.message}`;
      }
    } else if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      // In a full implementation, this would use Tesseract.js for OCR
      reply = 'I received your image file. In the full implementation, I would use OCR to extract and analyze text from this image.';
    } else if (ext === '.docx') {
      // In a full implementation, this would use mammoth.js
      reply = 'I received your Word document. In the full implementation, I would extract and analyze the text content from this document.';
    } else {
      reply = `I received your ${ext} file. This file type isn't fully supported for detailed analysis yet.`;
    }

    // Cleanup uploaded file
    fs.unlinkSync(file.path);

    res.json({ reply });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ reply: 'I encountered an error while processing your file.' });
  }
});

// Chat endpoint for text-based interactions
app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ reply: 'No message provided' });
    }
    
    // Process the message with AI
    const aiReply = await processWithAI(message);
    
    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ reply: 'Error processing your request.' });
  }
});

// Function to process messages with AI (Google Gemini)
async function processWithAI(message) {
  try {
    // Check if this is a system command
    if (message.toLowerCase().includes('open ')) {
      return `I would execute the system command to open the application. (In a full implementation, this would use Electron's IPC to trigger the action)`;
    }
    
    // Check for web automation requests
    if (message.toLowerCase().includes('bookmyshow') || 
        message.toLowerCase().includes('movie tickets')) {
      // Extract movie and city from message
      const movieMatch = message.match(/(?:for|movie)\s+([\w\s&]+?)(?:\s+in|\s+at|\s+tomorrow|$)/i);
      const cityMatch = message.match(/(?:in|at)\s+([\w\s]+?)(?:\s+tomorrow|\s+this|$)/i);
      
      const movie = movieMatch ? movieMatch[1].trim() : 'Deadpool';
      const city = cityMatch ? cityMatch[1].trim() : 'Hyderabad';
      
      try {
        const result = await webAutomator.searchBookMyShow({ movie, city });
        return `I searched for ${movie} tickets in ${city}. ${result.message}`;
      } catch (err) {
        return `I tried to search for movie tickets, but encountered an error: ${err.message}`;
      }
    }
    
    // Check for weather requests
    if (message.toLowerCase().includes('weather')) {
      const locationMatch = message.match(/weather\s+(?:in|at|for)\s+([\w\s]+)$/i) || 
                           message.match(/(?:in|at)\s+([\w\s]+?)(?:\s+weather)/i);
      
      const location = locationMatch ? locationMatch[1].trim() : 'Hyderabad';
      
      try {
        const result = await webAutomator.searchWeather({ location });
        return `Weather information: ${result.message}`;
      } catch (err) {
        return `I tried to get weather information, but encountered an error: ${err.message}`;
      }
    }
    
    // Check for YouTube requests
    if (message.toLowerCase().includes('youtube') && 
        (message.toLowerCase().includes('play') || message.toLowerCase().includes('search'))) {
      const queryMatch = message.match(/(?:play|search)\s+([\w\s]+?)(?:\s+on\s+youtube|$)/i);
      const query = queryMatch ? queryMatch[1].trim() : 'lofi beats';
      
      try {
        const result = await webAutomator.playYouTubeVideo({ query });
        return `I would play "${query}" on YouTube. ${result.message}`;
      } catch (err) {
        return `I tried to play a YouTube video, but encountered an error: ${err.message}`;
      }
    }
    
    // For demo purposes, return a simulated AI response
    // In production, this would call the Gemini API
    return `AI response to: "${message}". In a complete implementation, this would use the Google Gemini API or local Ollama with LLaMA 3.`;
  } catch (error) {
    console.error('AI processing error:', error);
    return 'I encountered an error while processing your request.';
  }
}

app.listen(3001, () => console.log('Server running on port 3001'));
