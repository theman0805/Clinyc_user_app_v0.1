// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for Expo SDK 53 + Supabase ws/stream error
// Disable package.json exports field support to resolve Node.js module issues
config.resolver.unstable_enablePackageExports = false;

module.exports = config; 