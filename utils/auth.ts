import { VALIDATION } from '../constants';

// Auth utility functions
export const validateEmail = (email: string): boolean => {
  return VALIDATION.email.pattern.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= VALIDATION.password.minLength && 
         VALIDATION.password.pattern.test(password);
};

export const validatePhone = (phone: string): boolean => {
  return VALIDATION.phone.pattern.test(phone);
};

export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  if (password.length < 6) return 'weak';
  if (password.length < 10) return 'medium';
  return 'strong';
};

export const formatUserName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return 'User';
  if (!lastName) return firstName || 'User';
  if (!firstName) return lastName;
  return `${firstName} ${lastName}`;
};

export const extractInitials = (name: string): string => {
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
};