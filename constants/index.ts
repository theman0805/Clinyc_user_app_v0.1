export * from './theme';

// App configuration constants
export const APP_CONFIG = {
  name: 'Clinyc User App',
  version: '1.0.0',
  description: 'A React Native mobile application for managing legal cases and client communications',
} as const;

// API configuration
export const API_CONFIG = {
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
} as const;

// File upload constants
export const FILE_UPLOAD = {
  maxSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  maxFiles: 5,
} as const;

// Validation constants
export const VALIDATION = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  password: {
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must contain at least 8 characters with uppercase, lowercase, number, and special character',
  },
  phone: {
    pattern: /^\+?[\d\s-()]+$/,
    message: 'Please enter a valid phone number',
  },
} as const;

// Storage keys
export const STORAGE_KEYS = {
  authToken: 'auth_token',
  userProfile: 'user_profile',
  appSettings: 'app_settings',
  lastSync: 'last_sync',
} as const;