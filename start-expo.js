// Simple script to start Expo since command line is having issues
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting Expo from custom script...');

// Check if expo binary exists
const expoBinPath = path.join(__dirname, 'node_modules', 'expo', 'bin', 'cli.js');

if (!fs.existsSync(expoBinPath)) {
  console.error(`Error: Could not find Expo CLI at ${expoBinPath}`);
  process.exit(1);
}

console.log(`Found Expo CLI at: ${expoBinPath}`);

// Start Expo by running the CLI directly
const expo = spawn('node', [expoBinPath, 'start'], {
  stdio: 'inherit',
  shell: true
});

expo.on('error', (err) => {
  console.error('Failed to start Expo:', err);
});

expo.on('close', (code) => {
  console.log(`Expo process exited with code ${code}`);
}); 