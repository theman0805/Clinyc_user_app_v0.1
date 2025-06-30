// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for Expo SDK 53 + Supabase ws/stream error
// Disable package.json exports field support to resolve Node.js module issues
config.resolver.unstable_enablePackageExports = false;

// Exclude problematic directories from file watching
config.watchFolders = config.watchFolders || [];
config.resolver.blockList = [
  /myenv\/.*/,
  /\.venv\/.*/,
  /path\/.*/,
  /\.cursor\/.*/,
  /node_modules\/.*\/node_modules\/.*/,
];

// Add Node.js polyfills for React Native
config.resolver.alias = {
  ...config.resolver.alias,
  buffer: require.resolve('buffer'),
};

// Configure resolver to handle Node.js modules
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config; 