import React, { useState, useEffect, useRef } from 'react';

function Chat({ onSendMessage, loading, reply, streamingReply }) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setInput(transcript);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
    
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);
  
  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [reply, streamingReply]);
  
  // Handle voice input
  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };
  
  // Handle send message
  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Chat area */}
      <div 
        ref={chatContainerRef}
        className="flex-grow overflow-y-auto p-4 bg-gray-50"
      >
        {!reply && !streamingReply && (
          <div className="text-center text-gray-500 mt-32">
            <p className="text-xl">👋 How can I help you today?</p>
            <p className="text-sm mt-2">Try saying "Search for weather in New York" or "Open YouTube and play lofi beats"</p>
          </div>
        )}
        
        {(reply || streamingReply) && (
          <div className="space-y-4">
            {input && (
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
                  <p>{input}</p>
                </div>
              </div>
            )}
            
            <div className="flex">
              <div className="bg-gray-200 p-3 rounded-lg max-w-md">
                <p className="whitespace-pre-line">{loading ? streamingReply : reply}</p>
                {loading && <span className="inline-block animate-pulse">▌</span>}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <textarea
            className="flex-grow p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows="2"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message or command..."
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
          />
          
          <button
            className={`p-2 rounded-full ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-100 hover:bg-blue-200'}`}
            onClick={toggleListening}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke={isListening ? 'white' : 'currentColor'}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold p-2 rounded-lg"
            onClick={handleSend}
            disabled={loading || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        {isListening && (
          <div className="mt-2 text-center text-sm text-blue-500 animate-pulse">
            Listening... Speak now
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;