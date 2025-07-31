import React, { useState } from 'react';
import './App.css';
function App() {
  const [input, setInput] = useState('');
   const [file, setFile] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      setReply(data.reply);
    } catch (err) {
      console.error('Error:', err);
      setReply('Something went wrong.');
    }
    setLoading(false);
  };

  const handleFileUpload = async (file) => {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://localhost:3001/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    setReply(data.reply);
  } catch (err) {
    console.error('Upload error:', err);
    setReply('Failed to analyze the file.');
  }
  setLoading(false);
};


  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h1 className="text-xl font-bold text-center">🤖 AI Agent</h1>
      <textarea
        className="w-full p-2 border rounded"
        rows="4"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask me something..."
      />

      <input
        type="file"
        accept=".txt,.pdf,image/*"
        onChange={(e) => handleFileUpload(e.target.files[0])}
      />

      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={handleSend}
        disabled={loading}
      >
        {loading ? 'Thinking...' : 'Send'}
      </button>

      {reply && (
        <div className="mt-4 p-3 border rounded bg-gray-100">
          <strong>AI Reply:</strong>
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
}

export default App;
