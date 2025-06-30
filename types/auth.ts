import { Session } from '@supabase/supabase-js';

// User types
export interface User {
  id: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  phone?: string;
  dateOfBirth?: string;
}

// Auth state types
export interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Auth action types
export interface AuthActions {
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthResult>;
  updateProfile: (updates: ProfileUpdates) => Promise<AuthResult>;
}

// Auth context type
export type AuthContextType = AuthState & AuthActions;

// Helper types
export interface AuthResult {
  error?: { message: string };
}

export interface ProfileUpdates {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
}

// User profile type (for auth context)
export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}