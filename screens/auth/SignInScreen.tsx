import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Button, TextInput, Text, Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/auth';
import { AuthStackParamList } from './SignUpScreen';

// Get the navigation prop type for the auth stack
type SignInScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignIn'>;

export default function SignInScreen() {
  // State for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get navigation and auth context
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const { signIn } = useAuth();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Handle sign in
  const handleSignIn = async () => {
    // Reset error message
    setError('');

    // Validate form fields
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.headerContainer}>
              <Text variant="headlineMedium" style={styles.headerText}>Welcome Back</Text>
              <Text variant="bodyLarge" style={styles.subHeaderText}>
                Log in to access your account
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* Email Input */}
              <TextInput
                label="Email Address"
                value={email}
                onChangeText={setEmail}
                left={<TextInput.Icon icon="email-outline" />}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
                mode="outlined"
              />

              {/* Password Input */}
              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={togglePasswordVisibility}
                  />
                }
                secureTextEntry={!showPassword}
                style={styles.input}
                mode="outlined"
              />

              {/* Forgot Password Link */}
              <TouchableOpacity 
                style={styles.forgotPasswordContainer}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              {/* Error message display */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Sign In Button */}
              <Button
                mode="contained"
                onPress={handleSignIn}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                loading={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Sign Up Link */}
              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  headerContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subHeaderText: {
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#1A5D1A',
    fontWeight: '500',
  },
  button: {
    marginTop: 10,
    paddingVertical: 4,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 15,
    textAlign: 'center',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#666666',
    fontSize: 16,
  },
  signUpLink: {
    color: '#1A5D1A',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
}); 