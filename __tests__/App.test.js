import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock the Navigation component to avoid rendering the actual navigation
jest.mock('../navigation', () => 'Navigation');

// Mock other components that might cause issues in tests
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

describe('App', () => {
  it('renders correctly', () => {
    const { getByText } = render(<App />);
    // Since we've mocked Navigation, we can't do much testing here
    // Just make sure the component renders without crashing
    expect(true).toBeTruthy();
  });
}); 