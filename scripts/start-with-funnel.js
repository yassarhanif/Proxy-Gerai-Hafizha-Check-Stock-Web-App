const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Path to the main API script
const apiScript = path.join(__dirname, '../dist/index.js');

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir);
    console.log('Created logs directory');
  } catch (error) {
    console.error('Error creating logs directory:', error.message);
  }
}

// Function to log to a file
function logToFile(message) {
  const logFile = path.join(__dirname, '../logs/service-wrapper.log');
  const timestamp = new Date().toISOString();
  try {
    fs.appendFileSync(logFile, `${timestamp} - ${message}\n`);
  } catch (error) {
    console.error('Error writing to log file:', error.message);
  }
}

// Possible paths for tailscale executable
const tailscalePaths = [
  'C:\\Program Files\\Tailscale\\tailscale.exe',
  'C:\\ProgramData\\Tailscale\\tailscale.exe',
  'tailscale' // fallback to PATH
];

// Function to find the tailscale executable
function findTailscaleExecutable() {
  for (const tsPath of tailscalePaths) {
    if (tsPath === 'tailscale') return tsPath; // Return the fallback option
    try {
      if (fs.existsSync(tsPath)) {
        return tsPath;
      }
    } catch (error) {
      // Ignore errors and try the next path
    }
  }
  return 'tailscale'; // Default fallback
}

// Start the API
logToFile('Starting API server...');
try {
  const apiProcess = spawn('node', [apiScript], {
    detached: true,
    stdio: 'ignore'
  });

  apiProcess.on('error', (err) => {
    logToFile(`Error starting API server: ${err.message}`);
  });

  apiProcess.unref();
  logToFile(`API server started with PID: ${apiProcess.pid}`);

  // Wait a moment to ensure API is starting up
  setTimeout(() => {
    // Start the Tailscale funnel
    logToFile('Starting Tailscale funnel...');
    
    try {
      const tailscaleExe = findTailscaleExecutable();
      logToFile(`Using Tailscale executable: ${tailscaleExe}`);
      
      // Using spawn to run the tailscale funnel command
      const tailscaleProcess = spawn(tailscaleExe, ['funnel', '3002'], {
        detached: true,
        stdio: 'ignore'
      });

      
      tailscaleProcess.on('error', (err) => {
        logToFile(`Error in Tailscale funnel process: ${err.message}`);
      });
      
      tailscaleProcess.unref();
      logToFile(`Tailscale funnel started with PID: ${tailscaleProcess.pid}`);
    } catch (error) {
      logToFile(`Error starting Tailscale funnel: ${error.message}`);
    }
  }, 5000); // Wait 5 seconds before starting the funnel
} catch (error) {
  logToFile(`Critical error starting API server: ${error.message}`);
}

// Keep the script running to maintain the child processes
// The Windows service will manage this script's lifecycle
setInterval(() => {
  // Just keep the process alive
  logToFile('Service wrapper is running...');
}, 60000); // Log every minute
