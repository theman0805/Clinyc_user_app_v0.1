import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/auth';
import Navigation from './navigation';
import { lightTheme } from './constants/theme';
// Import gesture handler is now handled in AppEntry.js

export default function App() {
  return (
    <PaperProvider theme={lightTheme}>
      <SafeAreaProvider>
        <AuthProvider>
          <Navigation />
          <StatusBar style="auto" />
        </AuthProvider>
      </SafeAreaProvider>
    </PaperProvider>
  );
} 