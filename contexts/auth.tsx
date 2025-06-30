import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, fetchUserProfile, updateUserProfile } from '../services/supabase';
import { AuthContextType, AuthState, User, AuthResult, ProfileUpdates } from '../types/auth';

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Check for active session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.fullName || '',
            },
            session,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setState({
          user: null,
          session: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        if (session?.user) {
          setState({
            user: {
              id: session.user.id,
              email: session.user.email || '',
              fullName: session.user.user_metadata?.fullName || '',
            },
            session,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setState({
            user: null,
            session: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      setState((prev: AuthState) => ({ ...prev, isLoading: true }));
      console.log(`Attempting to sign in with email: ${email}`);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        console.error('Sign in error:', error.message);
        return { error: { message: error.message } };
      }
      
      console.log('Sign in successful');
      return {};
    } catch (error: any) {
      console.error('Failed to sign in', error);
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    } finally {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
    }
  };

  // Create user profile in profiles table
  const createUserProfile = async (userId: string, email: string, fullName?: string) => {
    try {
      let firstName = '';
      let lastName = '';
      
      if (fullName) {
        const nameParts = fullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
      }
      
      const { error } = await supabase
        .from('profiles')
        .insert([
          { 
            id: userId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ]);
        
      if (error) {
        console.error('Error creating user profile:', error);
        return { error };
      }
      
      return { error: null };
    } catch (error: any) {
      console.error('Failed to create user profile', error);
      return { error };
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
    try {
      setState((prev: AuthState) => ({ ...prev, isLoading: true }));
      console.log(`Attempting to sign up with email: ${email}`);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { fullName },
        },
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        return { error: { message: error.message } };
      }
      
      // Create user profile in the profiles table
      if (data?.user) {
        const { error: profileError } = await createUserProfile(
          data.user.id,
          email,
          fullName
        );
        
        if (profileError) {
          console.error('Error creating profile after signup:', profileError);
          // We don't return error here as auth was successful
        }
      }
      
      console.log('Sign up successful');
      return {};
    } catch (error: any) {
      console.error('Failed to sign up', error);
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    } finally {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setState((prev: AuthState) => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
      }
      
      setState({
        user: null,
        session: null,
        isLoading: false,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Failed to sign out', error);
    } finally {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<AuthResult> => {
    try {
      setState((prev: AuthState) => ({ ...prev, isLoading: true }));
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'io.clinyc.app://reset-password/',
      });
      
      if (error) {
        return { error: { message: error.message } };
      }
      
      return {};
    } catch (error: any) {
      console.error('Failed to reset password', error);
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    } finally {
      setState((prev: AuthState) => ({ ...prev, isLoading: false }));
    }
  };

  // Update user profile
  const updateProfile = async (updates: ProfileUpdates): Promise<AuthResult> => {
    try {
      if (!state.user?.id) {
        return { error: { message: 'User not authenticated' } };
      }
      
      const { data, error } = await updateUserProfile(state.user.id, updates);
      
      if (error) {
        return { error: { message: error.message || 'Failed to update profile' } };
      }
      
      return {};
    } catch (error: any) {
      return {
        error: {
          message: error.message || 'An unexpected error occurred',
        },
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
} 