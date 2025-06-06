/**
 * Validates if the provided string is a valid email format
 * @param email The email string to validate
 * @returns boolean indicating if the email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password strength
 * Requirements:
 * - At least 8 characters
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * 
 * @param password The password to validate
 * @returns boolean indicating if the password meets requirements
 */
export const isStrongPassword = (password: string): boolean => {
  // At least 8 characters
  if (password.length < 8) return false;
  
  // Contains at least one uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Contains at least one lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Contains at least one number
  if (!/[0-9]/.test(password)) return false;
  
  return true;
};

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
 * Validates phone number format (basic validation)
 * @param phone The phone number to validate
 * @returns boolean indicating if the phone number is valid
 */
export const isValidPhone = (phone: string): boolean => {
  // Remove spaces, dashes, and parentheses before testing
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  // Basic check: 10+ digits
  return /^\+?[\d]{10,}$/.test(cleanPhone);
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