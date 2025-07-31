# 🤖 AI Agent Chatbot

A full-stack AI chatbot application that runs a local Large Language Model using Ollama, featuring a React frontend and a Node.js backend. This project allows for private, cost-free, and powerful AI interactions directly on your own machine.
(For now, using the ollama engine llama3 as the backend API)
---                                              

## ✨ Key Features

- **Real-time Chat Interface:** A clean and responsive UI built with React.
- **Locally-Hosted AI:** Powered by Ollama and Llama 3, ensuring privacy and eliminating API costs.
- **Full-Stack Architecture:** Decoupled Node.js backend and React frontend for modularity and scalability.
- **Private & Secure:** All conversations and data remain on your local machine.

---

## 🛠️ Tech Stack
  
- **Frontend:** React, CSS
- **Backend:** Node.js, Express.js, Axios
- **AI Engine:** Ollama with the Llama 3 model

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later)
- [Ollama](https://ollama.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/](https://github.com/)[your-github-username]/ai-agent.git
    cd ai-agent
    ```

2.  **Setup the Backend:**
    - Open a new terminal window.
    - Navigate to the backend directory:
      ```bash
      cd ai-agent-backend
      ```
    - Install the required dependencies:
      ```bash
      npm install
      ```

3.  **Setup the Frontend:**
    - Open another new terminal window.
    - Navigate to the frontend directory:
      ```bash
      cd ai-agent-app
      ```
    - Install the required dependencies:
      ```bash
      npm install
      ```

### Running the Application

1.  **Pull the AI Model:**
    - In any terminal, make sure Ollama has the `llama3` model. If not, run:
      ```bash
      ollama pull llama3
      ```

2.  **Start the Backend Server:**
    - In your backend terminal (`ai-agent-backend`):
      ```bash
      node index.js
      ```
    - The server should now be running on `http://localhost:3001`.

3.  **Start the Frontend Application:**
    - In your frontend terminal (`ai-agent-app`):
      ```bash
      npm run dev
      ```
    - Open your browser and navigate to the URL provided (usually `http://localhost:5173`).

You should now be able to interact with your AI Agent!
