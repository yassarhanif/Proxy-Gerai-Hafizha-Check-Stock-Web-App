const { Service } = require('node-windows');
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'GeraiHafizhaProxyAPI',
  description: 'Database proxy API for Gerai Hafizha Stock Checker',
  script: path.join(__dirname, '../dist/index.js')
});

// Listen for uninstall events
svc.on('uninstall', () => {
  console.log('Service uninstalled successfully');
});

svc.on('error', (err) => {
  console.error('Error uninstalling service:', err);
});

// Uninstall the service
console.log('Uninstalling Gerai Hafizha Proxy API Windows service...');
svc.uninstall();
