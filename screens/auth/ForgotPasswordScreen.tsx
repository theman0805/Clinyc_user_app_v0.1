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
import { AuthStackParamList } from './SignUpScreen';

// Get the navigation prop type for the auth stack
type ForgotPasswordScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  // State for form fields
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Get navigation and auth context
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { resetPassword } = useAuth();

  // Handle password reset
  const handleResetPassword = async () => {
    // Reset error message
    setError('');

    // Validate email
    if (!email) {
      setError('Email address is required');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      await resetPassword(email);
      setIsSuccess(true);
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
              <Text variant="headlineMedium" style={styles.headerText}>Reset Password</Text>
              <Text variant="bodyLarge" style={styles.subHeaderText}>
                {isSuccess
                  ? 'Check your email for a password reset link'
                  : 'Enter your email address to receive a password reset link'}
              </Text>
            </View>

            {!isSuccess ? (
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

                {/* Error message display */}
                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                {/* Reset Password Button */}
                <Button
                  mode="contained"
                  onPress={handleResetPassword}
                  disabled={isLoading}
                  style={styles.button}
                  contentStyle={styles.buttonContent}
                  loading={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>

                {/* Back to Sign In Link */}
                <View style={styles.backContainer}>
                  <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={styles.backText}>Back to Sign In</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.successContainer}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('SignIn')}
                  style={styles.button}
                >
                  Back to Sign In
                </Button>
              </View>
            )}
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
  backContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  backText: {
    color: '#1A5D1A',
    fontSize: 16,
    fontWeight: '500',
  },
  successContainer: {
    alignItems: 'center',
  },
}); 