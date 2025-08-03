import React, { useState, useEffect } from 'react';
import './App.css';
import Chat from './components/Chat';
function App() {
  const [file, setFile] = useState(null);
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingReply, setStreamingReply] = useState('');
  
  // Check if Electron is available
  const [isElectron, setIsElectron] = useState(false);
  
  useEffect(() => {
    // Check if running in Electron
    setIsElectron(window.electronAPI !== undefined);
  }, []);

  const handleSendMessage = async (input) => {
    setLoading(true);
    setStreamingReply('');
    
    try {
      // Check if this is a system command to open an application
      if (input.toLowerCase().includes('open ') && window.electronAPI) {
        const appMatch = input.match(/open\s+([\w\s]+?)(?:\s+and|\s+to|\s+for|$)/i);
        if (appMatch && appMatch[1]) {
          const appName = appMatch[1].trim();
          try {
            const result = await window.electronAPI.openApplication(appName);
            
            // Simulate streaming response
            const words = result.split(' ');
            let currentReply = '';
            
            for (let i = 0; i < words.length; i++) {
              currentReply += words[i] + ' ';
              setStreamingReply(currentReply);
              await new Promise(resolve => setTimeout(resolve, 30));
            }
            
            setReply(result);
            setLoading(false);
            return;
          } catch (error) {
            console.error('Application open error:', error);
            setReply(`I couldn't open ${appName}. ${error.message}`);
            setLoading(false);
            return;
          }
        }
      }
      
      // For all other commands, send to backend
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      
      // Simulate streaming response for better UX
      const words = data.reply.split(' ');
      let currentReply = '';
      
      for (let i = 0; i < words.length; i++) {
        currentReply += words[i] + ' ';
        setStreamingReply(currentReply);
        // Small delay to simulate typing
        await new Promise(resolve => setTimeout(resolve, 30));
      }
      
      setReply(data.reply);
    } catch (err) {
      console.error('Error:', err);
      setReply('Something went wrong with your request. Please try again.');
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
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-white">
          <h1 className="text-2xl font-bold flex items-center">
            <span className="text-3xl mr-2">🧠</span> AI Desktop Agent
          </h1>
          <p className="text-blue-100 text-sm">
            Your voice & task-oriented assistant
            {isElectron && <span className="ml-2 px-2 py-0.5 bg-green-500 rounded-full text-xs">Desktop Mode</span>}
          </p>
        </div>
        
        {/* Chat component */}
        <div className="h-96">
          <Chat 
            onSendMessage={handleSendMessage}
            loading={loading}
            reply={reply}
            streamingReply={streamingReply}
          />
        </div>
        
        {/* File upload area */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-20 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="text-sm text-blue-500">
                  <span className="font-semibold">Upload a file</span> or drag and drop
                </p>
                <p className="text-xs text-blue-400">
                  TXT, PDF, DOCX, or images
                </p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".txt,.pdf,.docx,image/*"
                onChange={(e) => handleFileUpload(e.target.files[0])}
              />
            </label>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        Powered by React, {isElectron ? 'Electron' : 'Web'}, and AI | <span className="text-blue-500">AI Desktop Agent</span>
      </div>
    </div>
  );
}

export default App;
