🧠 AI Desktop Agent

A fully functional voice & task-oriented assistant that operates as both a desktop and web automation tool. Powered by natural language understanding, it can accept user commands through text or speech, interpret intent using AI models, and take real-world actions.

## Features

### Text & Voice Interface
- Fully responsive React (JSX) chat interface styled with Tailwind CSS
- Speech recognition using the Web Speech API — users can speak commands instead of typing
- Displays AI replies in real time, mimicking a virtual assistant

### Local Task Automation
- Electron.js enables OS-level integration: open apps like Chrome, Excel, Notepad, or File Explorer on command
- Interprets commands using the AI engine, then triggers the right process securely using Electron's preload bridge

### Web Automation
- Uses Puppeteer to perform complex web tasks like:
  - Searching BookMyShow and listing movie tickets
  - Checking weather information
  - Playing videos on YouTube
- Automation is triggered via natural prompts

### File Understanding
- Full .txt previewing with no content truncation
- PDF analysis using pdf-parse
- Support for images and .docx parsing (planned)

## Project Structure

```
AI-AGENT/
│
├── README.md                     # Main project documentation
├── requirements.txt              # Project requirements
│
├── ai-agent-app/                 # Frontend: Electron + React
│   ├── .gitignore                # Git ignore file
│   ├── README.md                 # Frontend documentation
│   ├── eslint.config.js          # ESLint configuration
│   ├── index.html                # HTML entry point
│   ├── main.js                   # Electron main process
│   ├── package.json              # Frontend dependencies
│   ├── package-lock.json         # Dependency lock file
│   ├── preload.js                # Secure Electron-Renderer bridge
│   ├── vite.config.js            # Vite configuration
│   ├── public/                   # Static assets
│   │   └── vite.svg              # Vite logo
│   └── src/                      # React source code
│       ├── App.css               # App styles
│       ├── App.jsx               # Main application component
│       ├── index.css             # Global styles
│       ├── main.jsx              # React entry point
│       ├── assets/               # Static assets
│       └── components/           # React components
│
└── ai-agent-backend/            # Backend: Node.js + Express + Puppeteer
    ├── .env                      # Environment variables
    ├── index.js                  # Express server + AI integration
    ├── package.json              # Backend dependencies
    ├── package-lock.json         # Dependency lock file
    ├── tools/                    # Automation tools
    │   └── web_automator.js      # Puppeteer automation logic
    └── uploads/                  # Upload directory
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd ai-agent-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the backend server:
   ```
   node index.js
   ```
   The server will run on port 3001.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd ai-agent-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run in development mode with Electron:
   ```
   npm run electron:dev
   ```

4. For production build:
   ```
   npm run electron:build
   ```

## Usage Examples

- "Open Excel and create a new budget sheet."
- "Book 2 tickets for Deadpool & Wolverine in PVR Hyderabad this weekend."
- "Open YouTube and play LoFi study beats."
- "Read this PDF and summarize the main points."
- "What's the weather like in New York today?"

## Tech Stack

- **Frontend**: React, Tailwind CSS, Web Speech API
- **Desktop Layer**: Electron.js
- **Backend**: Node.js, Express.js
- **Web Automation**: Puppeteer
- **File Parsing**: pdf-parse, fs
- **AI Engine**: Google Gemini 1.5 Pro (with optional Ollama/LLaMA 3 support)

## Security & Safety

- Uses Electron preload scripts for secure IPC (Inter-Process Communication)
- All automation tasks are controlled only through explicit AI-interpreted prompts
- Restricted system command execution.