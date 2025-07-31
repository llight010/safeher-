import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import * as Device from 'expo-device';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const RegisterScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { register, isAuthenticating } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    const deviceInfo = {
      id: Device.osInternalBuildId || 'unknown',
      type: Device.deviceType || 'unknown',
      os: Device.osName || 'unknown',
      app: '1.0',
    };

    const result = await register(name, email, phone, password, deviceInfo);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <LinearGradient
      colors={mode === 'dark'
        ? ['#232526', '#414345']
        : ['#ffecd2', '#fcb69f']}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardContainer}
      >
        <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.text }]}>
          <LottieView
            source={require('../../assets/animations/register.json')}
            autoPlay
            loop
            style={styles.lottie}
          />

          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.secondaryText }]}>Sign up to continue</Text>

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
            placeholder="Name"
            placeholderTextColor={theme.secondaryText}
            value={name}
            onChangeText={setName}
          />

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
            placeholder="Phone"
            placeholderTextColor={theme.secondaryText}
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
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

          <TouchableOpacity
            style={[styles.registerButton, { backgroundColor: theme.primary }]}
            onPress={handleRegister}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.text }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.loginText, { color: theme.primary }]}> Login</Text>
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
    elevation: 10,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    alignItems: 'center',
  },
  lottie: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
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
    marginBottom: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  registerButton: {
    height: 50,
    width: '100%',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 8,
  },
  registerButtonText: {
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
  loginText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
