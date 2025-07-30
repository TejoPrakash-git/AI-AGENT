const express = require('express');
const cors = require('cors');
const axios = require('axios');

// Initialize the Express application
const app = express();

// Define the port for the server
const port = 3001;

// Apply middleware
app.use(cors());      // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

// Define the main API endpoint for the chat
app.post('/chat', async (req, res) => {
  // Get the user's message from the request body
  const userMessage = req.body.message;

  // Check if a message was provided
  if (!userMessage) {
    return res.status(400).json({ reply: "Error: A 'message' field is required." });
  }

  try {
    // Send the request to the local Ollama server
    const ollamaResponse = await axios.post('http://localhost:11434/api/generate', {
      model: "llama3",
      prompt: userMessage,
      stream: false
    });

    // Extract the AI's reply from the Ollama response
    const aiReply = ollamaResponse.data.response;

    // Send the AI's reply back to the frontend
    res.json({ reply: aiReply });

  } catch (error) {
    // Log the error and send a generic error message
    console.error("Error communicating with Ollama:", error.message);
    res.status(500).json({ reply: "Error: Could not get a response from the AI engine." });
  }
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`✅ Server is running successfully at http://localhost:${port}`);
});