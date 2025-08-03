const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');
const url = require('url');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      nodeIntegration: false, // Security: Disable Node.js integration in renderer
      contextIsolation: true, // Security: Enable context isolation
      preload: path.join(__dirname, 'preload.js') // Use preload script for secure IPC
    }
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    // Open DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from built files
    mainWindow.loadURL(
      url.format({
        pathname: path.join(__dirname, 'dist', 'index.html'),
        protocol: 'file:',
        slashes: true
      })
    );
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create window when Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS, re-create a window when dock icon is clicked and no windows are open
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers for system operations

// Handle opening applications
ipcMain.handle('open-application', async (event, appName) => {
  try {
    let command;
    
    // Determine the command based on platform and app name
    if (process.platform === 'win32') {
      // Windows commands
      switch (appName.toLowerCase()) {
        case 'chrome':
        case 'google chrome':
          command = 'start chrome';
          break;
        case 'excel':
        case 'microsoft excel':
          command = 'start excel';
          break;
        case 'word':
        case 'microsoft word':
          command = 'start winword';
          break;
        case 'notepad':
          command = 'start notepad';
          break;
        case 'file explorer':
        case 'explorer':
          command = 'start explorer';
          break;
        case 'youtube':
          command = 'start chrome https://www.youtube.com';
          break;
        default:
          command = `start ${appName}`;
      }
    } else if (process.platform === 'darwin') {
      // macOS commands
      switch (appName.toLowerCase()) {
        case 'chrome':
        case 'google chrome':
          command = 'open -a "Google Chrome"';
          break;
        case 'excel':
        case 'microsoft excel':
          command = 'open -a "Microsoft Excel"';
          break;
        case 'word':
        case 'microsoft word':
          command = 'open -a "Microsoft Word"';
          break;
        case 'notes':
        case 'textedit':
          command = 'open -a TextEdit';
          break;
        case 'finder':
        case 'file explorer':
          command = 'open .';
          break;
        case 'youtube':
          command = 'open -a "Google Chrome" https://www.youtube.com';
          break;
        default:
          command = `open -a "${appName}"`;
      }
    } else {
      // Linux commands
      switch (appName.toLowerCase()) {
        case 'chrome':
        case 'google chrome':
          command = 'google-chrome';
          break;
        case 'firefox':
          command = 'firefox';
          break;
        case 'file explorer':
        case 'files':
          command = 'xdg-open .';
          break;
        case 'youtube':
          command = 'xdg-open https://www.youtube.com';
          break;
        default:
          command = appName;
      }
    }
    
    // Execute the command
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error opening ${appName}:`, error);
          reject(`Failed to open ${appName}: ${error.message}`);
          return;
        }
        resolve(`Successfully opened ${appName}`);
      });
    });
  } catch (error) {
    console.error('Application open error:', error);
    throw new Error(`Failed to open application: ${error.message}`);
  }
});

// Handle system commands (with security restrictions)
ipcMain.handle('execute-command', async (event, command) => {
  // SECURITY: This is a simplified example. In a real app, you would:
  // 1. Whitelist allowed commands
  // 2. Sanitize inputs
  // 3. Add user confirmation for sensitive operations
  // 4. Implement proper permission system
  
  // For demo purposes, we'll restrict to very basic commands
  const allowedCommands = ['echo', 'date', 'time'];
  
  // Simple check if command starts with an allowed prefix
  const isAllowed = allowedCommands.some(cmd => command.startsWith(cmd));
  
  if (!isAllowed) {
    throw new Error('Command not allowed for security reasons');
  }
  
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Command failed: ${error.message}`);
        return;
      }
      resolve(stdout);
    });
  });
});