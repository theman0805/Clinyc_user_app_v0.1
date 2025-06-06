import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './contexts/auth';
import Navigation from './navigation';
// Import gesture handler is now handled in AppEntry.js

// Define the app theme colors using react-native-paper
const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1A5D1A', // Forest green for a healthcare app
    secondary: '#3ECF8E', // Supabase-inspired accent color
    background: '#FFFFFF',
    error: '#D32F2F',
  },
};

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3ECF8E',
    secondary: '#1A5D1A',
    background: '#121212',
    error: '#EF5350',
  },
};

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