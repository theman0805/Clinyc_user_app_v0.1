// Standard Expo AppEntry.js
import { registerRootComponent } from 'expo';

// Install Node.js polyfills for React Native
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import App from './App';

// Register the main App component
registerRootComponent(App); 