// Jest configuration to properly handle Expo and React Native
module.exports = {
  preset: 'jest-expo',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
  ],
  setupFiles: [
    '<rootDir>/jest.setup.js'
  ],
  setupFilesAfterEnv: [
    '@testing-library/jest-native/extend-expect'
  ],
  moduleNameMapper: {
    // Handle module aliases (if you have any in your project)
    '^@/(.*)$': '<rootDir>/$1'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/coverage/**',
    '!**/node_modules/**',
    '!**/babel.config.js',
    '!**/jest.setup.js'
  ]
}; 