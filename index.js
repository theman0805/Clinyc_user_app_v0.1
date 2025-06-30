// Entry point for the app - using require to avoid transformation issues
require('react-native-gesture-handler');
require('react-native-url-polyfill/auto');

const { registerRootComponent } = require('expo');
const { AppRegistry } = require('react-native');
const App = require('./App.tsx').default;

// Register the app with both Expo and React Native for maximum compatibility
registerRootComponent(App);
AppRegistry.registerComponent('main', () => App);

// Remove the import to AppEntry.js to avoid circular references
// import './AppEntry.js'; 