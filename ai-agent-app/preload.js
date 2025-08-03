const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // System operations
  openApplication: (appName) => ipcRenderer.invoke('open-application', appName),
  executeCommand: (command) => ipcRenderer.invoke('execute-command', command),
  
  // Add more API methods as needed
});