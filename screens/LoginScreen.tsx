import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { isValidEmail } from '../utils/validators';
import { useAuth } from '../contexts/auth';

const LoginScreen = ({ navigation }: any) => {
  // Initialize with test credentials to make login easier
  const [email, setEmail] = useState('user@clinyc.com');
  const [password, setPassword] = useState('ClinyC123!');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { signIn, isLoading, isAuthenticated } = useAuth();

  // If user is already authenticated, navigate to Home
  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Home');
    }
  }, [isAuthenticated, navigation]);

  const validateInputs = () => {
    let isValid = true;

    // Validate email
    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email');
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!password.trim()) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (validateInputs()) {
      try {
        const { error } = await signIn(email, password);
        
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            Alert.alert(
              'Login Failed', 
              'Invalid email or password. Please check your credentials and try again.'
            );
          } else {
            Alert.alert(
              'Login Failed', 
              error.message
            );
          }
          console.error('Login error:', error.message);
        }
        // Navigation will be handled by the useEffect monitoring isAuthenticated
      } catch (error: any) {
        Alert.alert(
          'Login Error', 
          'An unexpected error occurred. Please try again later.'
        );
        console.error('Login exception:', error);
      }
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  const handleDemoLogin = async () => {
    setEmail('user@clinyc.com');
    setPassword('ClinyC123!');
    // Wait a bit for state to update, then trigger login
    setTimeout(handleLogin, 100);
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          </View>

          <TouchableOpacity onPress={handleForgotPassword}>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, styles.demoButton]} 
            onPress={handleDemoLogin}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>Use Demo Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 5,
  },
  forgotPassword: {
    color: '#007AFF',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  demoButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 5,
  },
});

export default LoginScreen; 