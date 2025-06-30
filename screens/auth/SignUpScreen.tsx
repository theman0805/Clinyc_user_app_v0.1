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
import { isValidEmail } from '../../utils/validators';

// Define the authentication stack param list type
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Get the navigation prop type for the auth stack
type SignUpScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'SignUp'>;

export default function SignUpScreen() {
  // State for form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get navigation and auth context
  const navigation = useNavigation<SignUpScreenNavigationProp>();
  const { signUp } = useAuth();

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Handle sign up
  const handleSignUp = async () => {
    // Reset error message
    setError('');

    // Validate form fields
    if (!fullName || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password, fullName);
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
              <Text variant="headlineMedium" style={styles.headerText}>Create Account</Text>
              <Text variant="bodyLarge" style={styles.subHeaderText}>
                Please fill in the details to create your account
              </Text>
            </View>

            <View style={styles.formContainer}>
              {/* Full Name Input */}
              <TextInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                left={<TextInput.Icon icon="account-outline" />}
                autoCapitalize="words"
                autoCorrect={false}
                style={styles.input}
                mode="outlined"
              />

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

              {/* Confirm Password Input */}
              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                left={<TextInput.Icon icon="lock-outline" />}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? 'eye-off' : 'eye'}
                    onPress={toggleConfirmPasswordVisibility}
                  />
                }
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                mode="outlined"
              />

              {/* Error message display */}
              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              {/* Sign Up Button */}
              <Button
                mode="contained"
                onPress={handleSignUp}
                disabled={isLoading}
                style={styles.button}
                contentStyle={styles.buttonContent}
                loading={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Button>

              {/* Sign In Link */}
              <View style={styles.signInContainer}>
                <Text style={styles.signInText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                  <Text style={styles.signInLink}>Sign In</Text>
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
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#666666',
    fontSize: 16,
  },
  signInLink: {
    color: '#1A5D1A',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
}); 