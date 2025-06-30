// Export all utility functions
export * from './auth';
export * from './format';
export * from './validators';

// Storage utilities (for future implementation)
export const storage = {
  get: async (key: string) => {
    // Implementation would use AsyncStorage
    return null;
  },
  set: async (key: string, value: any) => {
    // Implementation would use AsyncStorage
    return;
  },
  remove: async (key: string) => {
    // Implementation would use AsyncStorage
    return;
  },
};