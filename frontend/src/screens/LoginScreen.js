import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import * as Device from 'expo-device';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { login, isAuthenticating } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    const deviceInfo = {
      id: Device.osInternalBuildId || 'unknown',
      type: Device.deviceType || 'unknown',
      os: Device.osName || 'unknown',
      app: '1.0',
    };

    const result = await login(email, password, deviceInfo);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <LinearGradient
      colors={mode === 'dark'
        ? ['#232526', '#414345']
        : ['#fceabb', '#f8b500']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.text }]}>
          <LottieView
            source={require('../../assets/animations/login.json')}
            autoPlay
            loop
            style={styles.lottie}
          />

          <Text style={[styles.title, { color: theme.text }]}>Welcome Back</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Sign in to continue</Text>

          {error ? (
            <Text style={[styles.errorText, { color: theme.emergency }]}>
              ❌ {error}
            </Text>
          ) : null}

          <TextInput
            style={[styles.input, {
              backgroundColor: theme.inputBackground || theme.cardBackground,
              color: theme.text,
              borderColor: theme.secondaryText,
            }]}
            placeholder="Email"
            placeholderTextColor={theme.secondaryText}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <TextInput
            style={[styles.input, {
              backgroundColor: theme.inputBackground || theme.cardBackground,
              color: theme.text,
              borderColor: theme.secondaryText,
            }]}
            placeholder="Password"
            placeholderTextColor={theme.secondaryText}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={[styles.forgotText, { color: theme.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.primary }]}
            onPress={handleLogin}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.signupText, { color: theme.primary }]}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    padding: 30,
    borderRadius: 24,
    elevation: 12,
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    alignItems: 'center',
  },
  lottie: {
    width: 120,
    height: 120,
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    fontSize: 16,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  forgotText: {
    fontSize: 14,
  },
  loginButton: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  signupText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
