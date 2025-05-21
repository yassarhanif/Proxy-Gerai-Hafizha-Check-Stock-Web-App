const { Service } = require('node-windows');
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'GeraiHafizhaProxyAPI',
  description: 'Database proxy API for Gerai Hafizha Stock Checker with Tailscale Funnel',
  script: path.join(__dirname, './start-with-funnel.js'),
  nodeOptions: [],
  // Allow the service to restart on failure
  wait: 2,
  grow: 0.5,
  maxRestarts: 3
});

// Listen for service install events
svc.on('install', () => {
  console.log('Service installed successfully');
  svc.start();
});

svc.on('start', () => {
  console.log('Service started successfully');
  console.log('You can now access the API at http://localhost:3002');
  console.log('The service will automatically expose the API via Tailscale funnel');
  console.log('Check logs/service-wrapper.log for details on the Tailscale funnel status');
});

svc.on('alreadyinstalled', () => {
  console.log('Service is already installed');
});

svc.on('error', (err) => {
  console.error('Error installing service:', err);
});

// Install the service
console.log('Installing Gerai Hafizha Proxy API as a Windows service...');
svc.install();
