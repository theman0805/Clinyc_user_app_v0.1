import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

// Define the app theme colors using react-native-paper
export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1A5D1A', // Forest green for a healthcare app
    secondary: '#3ECF8E', // Supabase-inspired accent color
    background: '#FFFFFF',
    error: '#D32F2F',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#3ECF8E',
    secondary: '#1A5D1A',
    background: '#121212',
    error: '#EF5350',
  },
};

// Theme constants
export const COLORS = {
  primary: '#1A5D1A',
  secondary: '#3ECF8E',
  background: '#FFFFFF',
  error: '#D32F2F',
  success: '#4CAF50',
  warning: '#FF9800',
  info: '#2196F3',
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#999999',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;