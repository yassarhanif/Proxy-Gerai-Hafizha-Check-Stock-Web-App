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

// Global process references to keep them alive
let apiProcess = null;
let tailscaleProcess = null;

// Function to handle process cleanup
function cleanup() {
  logToFile('Performing cleanup...');
  if (apiProcess && !apiProcess.killed) {
    logToFile('Terminating API process...');
    apiProcess.kill();
  }
  if (tailscaleProcess && !tailscaleProcess.killed) {
    logToFile('Terminating Tailscale process...');
    tailscaleProcess.kill();
  }
}

// Handle process termination signals
process.on('SIGTERM', cleanup);
process.on('SIGINT', cleanup);
process.on('exit', cleanup);

// Start the API
logToFile('Starting API server...');
try {
  apiProcess = spawn('node', [apiScript], {
    stdio: ['ignore', 'pipe', 'pipe'], // Capture stdout and stderr
    cwd: path.join(__dirname, '..')
  });

  // Handle API process output
  apiProcess.stdout.on('data', (data) => {
    logToFile(`API stdout: ${data.toString().trim()}`);
  });

  apiProcess.stderr.on('data', (data) => {
    logToFile(`API stderr: ${data.toString().trim()}`);
  });

  apiProcess.on('error', (err) => {
    logToFile(`Error starting API server: ${err.message}`);
  });

  apiProcess.on('exit', (code, signal) => {
    logToFile(`API server exited with code ${code} and signal ${signal}`);
    apiProcess = null;
  });

  apiProcess.on('close', (code) => {
    logToFile(`API server closed with code ${code}`);
  });

  logToFile(`API server started with PID: ${apiProcess.pid}`);

  // Wait longer to ensure API is fully started
  setTimeout(() => {
    // Start the Tailscale funnel
    logToFile('Starting Tailscale funnel...');
    
    try {
      const tailscaleExe = findTailscaleExecutable();
      logToFile(`Using Tailscale executable: ${tailscaleExe}`);
      
      tailscaleProcess = spawn(tailscaleExe, ['funnel', '3002'], {
        stdio: ['ignore', 'pipe', 'pipe'] // Capture stdout and stderr
      });

      // Handle Tailscale process output
      tailscaleProcess.stdout.on('data', (data) => {
        logToFile(`Tailscale stdout: ${data.toString().trim()}`);
      });

      tailscaleProcess.stderr.on('data', (data) => {
        logToFile(`Tailscale stderr: ${data.toString().trim()}`);
      });

      tailscaleProcess.on('error', (err) => {
        logToFile(`Error in Tailscale funnel process: ${err.message}`);
      });

      tailscaleProcess.on('exit', (code, signal) => {
        logToFile(`Tailscale funnel exited with code ${code} and signal ${signal}`);
        tailscaleProcess = null;
      });

      tailscaleProcess.on('close', (code) => {
        logToFile(`Tailscale funnel closed with code ${code}`);
      });
      
      logToFile(`Tailscale funnel started with PID: ${tailscaleProcess.pid}`);
    } catch (error) {
      logToFile(`Error starting Tailscale funnel: ${error.message}`);
    }
  }, 10000); // Wait 10 seconds before starting the funnel
} catch (error) {
  logToFile(`Critical error starting API server: ${error.message}`);
}

// Keep the script running and monitor child processes
setInterval(() => {
  logToFile('Service wrapper is running...');
  
  // Check if API process is still alive
  if (apiProcess && apiProcess.pid) {
    try {
      process.kill(apiProcess.pid, 0); // Check if process exists
      logToFile(`API process (PID: ${apiProcess.pid}) is alive`);
    } catch (err) {
      logToFile(`API process appears to be dead: ${err.message}`);
      apiProcess = null;
    }
  } else {
    logToFile('API process is not running');
  }
  
  // Check if Tailscale process is still alive
  if (tailscaleProcess && tailscaleProcess.pid) {
    try {
      process.kill(tailscaleProcess.pid, 0); // Check if process exists
      logToFile(`Tailscale process (PID: ${tailscaleProcess.pid}) is alive`);
    } catch (err) {
      logToFile(`Tailscale process appears to be dead: ${err.message}`);
      tailscaleProcess = null;
    }
  } else {
    logToFile('Tailscale process is not running');
  }
}, 30000); // Log every 30 seconds instead of 60
