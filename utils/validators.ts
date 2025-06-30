// Re-export validation functions from the new auth utils
import { validateEmail, validatePassword, validatePhone } from './auth';

// Legacy function names for backward compatibility
export const isValidEmail = validateEmail;
export const isStrongPassword = validatePassword;
export const isValidPhone = validatePhone;

// Also export the new function names
export { validateEmail, validatePassword, validatePhone };

/**
 * Validates that two passwords match
 * @param password The original password
 * @param confirmPassword The confirmation password to check against
 * @returns boolean indicating if the passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validates name format (no numbers or special characters)
 * @param name The name to validate
 * @returns boolean indicating if the name is valid
 */
export const isValidName = (name: string): boolean => {
  // Only letters, spaces, and hyphens allowed
  return /^[a-zA-Z\s\-']+$/.test(name) && name.trim().length > 0;
};

// Date validation function
export const validateDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// File validation functions
export const validateFileType = (fileName: string, allowedTypes: string[]): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  return extension ? allowedTypes.includes(extension) : false;
};

export const validateFileSize = (fileSize: number, maxSize: number): boolean => {
  return fileSize <= maxSize;
};

// Form validation helpers
export const getValidationMessage = (field: string, value: string): string | null => {
  switch (field) {
    case 'email':
      return validateEmail(value) ? null : 'Please enter a valid email address';
    case 'password':
      return validatePassword(value) ? null : 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    case 'phone':
      return validatePhone(value) ? null : 'Please enter a valid phone number';
    case 'name':
      return isValidName(value) ? null : 'Name must contain only letters, spaces, and hyphens';
    default:
      return null;
  }
}; 