import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { RootStackParamList } from '../navigation/MainNavigator';
import TextInput from '../components/TextInput';
import Button from '../components/Button';

type SignupScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Signup'>;

const SignupScreen = () => {
  const { theme } = useTheme();
  const { signUp } = useUser();
  const navigation = useNavigation<SignupScreenNavigationProp>();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
    
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await signUp(email, password, name);
      // Navigation to main screen is handled in MainNavigator based on isAuthenticated state
    } catch (error) {
      Alert.alert(
        'Signup Failed',
        error instanceof Error ? error.message : 'Please check your information and try again'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTermsAcceptance = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.backButtonText, { color: theme.primary }]}>
                &lt; Back to Login
              </Text>
            </TouchableOpacity>
            
            <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Join HealthCoach and start your wellness journey
            </Text>
          </View>

          <View style={styles.formContainer}>
            <TextInput
              label="Full Name"
              value={name}
              onChangeText={setName}
              leftIcon="account"
              error={errors.name}
              autoCapitalize="words"
            />

            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon="email"
              error={errors.email}
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              leftIcon="lock"
              error={errors.password}
              helperText="Password must be at least 6 characters"
            />

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              leftIcon="lock-check"
              error={errors.confirmPassword}
            />

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={toggleTermsAcceptance}
            >
              <View style={[
                styles.checkbox,
                {
                  backgroundColor: acceptedTerms ? theme.primary : 'transparent',
                  borderColor: errors.terms ? theme.error : theme.border,
                }
              ]}>
                {acceptedTerms && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={[styles.termsText, { color: theme.text }]}>
                I accept the{' '}
                <Text style={{ color: theme.primary }}>Terms of Service</Text> and{' '}
                <Text style={{ color: theme.primary }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && (
              <Text style={[styles.errorText, { color: theme.error }]}>
                {errors.terms}
              </Text>
            )}

            <Button
              title="Create Account"
              onPress={handleSignUp}
              loading={isLoading}
              fullWidth
              style={styles.signUpButton}
            />
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginText, { color: theme.primary }]}> Sign In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  header: {
    marginTop: 16,
    marginBottom: 32,
  },
  backButton: {
    marginBottom: 24,
  },
  backButtonText: {
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  formContainer: {
    marginBottom: 24,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: 'white',
    fontWeight: 'bold',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
  },
  errorText: {
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
    marginLeft: 4,
  },
  signUpButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
  },
  footerText: {
    fontSize: 16,
  },
  loginText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignupScreen; 