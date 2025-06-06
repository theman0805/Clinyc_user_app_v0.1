// For packages missing type declarations, add them here

declare module '@rneui/themed' {
  import { ComponentType } from 'react';
  
  export function createTheme(theme: any): any;
  export const ThemeProvider: ComponentType<{ theme: any, children: React.ReactNode }>;
}

declare module 'expo-status-bar' {
  import { ComponentType } from 'react';
  
  export const StatusBar: ComponentType<{ style: 'auto' | 'light' | 'dark' }>;
}

declare module 'react-native-safe-area-context' {
  import { ComponentType } from 'react';
  
  export const SafeAreaProvider: ComponentType<{ children: React.ReactNode }>;
}

declare module 'react-native-paper' {
  import { ComponentType } from 'react';
  
  export const PaperProvider: ComponentType<{ children: React.ReactNode }>;
} 