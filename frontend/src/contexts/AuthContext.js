import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { loginUser, registerUser, validateToken } from '../services/api';
import { navigate } from '../navigation/NavigationService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('🟢 AuthProvider mounted.');
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken');
      const userData = await AsyncStorage.getItem('user');

      if (token && userData) {
        console.log('🔍 Found token. Validating...');
        const res = await validateToken();
        if (res.valid) {
          console.log('✅ Token valid. Restoring session.');
          setAuthToken(token);
          setUser(JSON.parse(userData));
        } else {
          console.log('⛔ Token expired. Logging out.');
          await logout();
        }
      } else {
        console.log('📭 No token or user found in storage.');
      }
    } catch (error) {
      console.error('❌ Token validation failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password, deviceInfo) => {
    try {
      setIsLoading(true);
      const response = await loginUser({ email, password, device: deviceInfo });
      const { token, user } = response;

      await SecureStore.setItemAsync('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setAuthToken(token);
      setUser(user);
      navigate('Main');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Login failed. Try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, phone, password, deviceInfo) => {
    try {
      setIsLoading(true);
      const response = await registerUser({
        name,
        email,
        phone,
        password,
        device: deviceInfo,
      });

      const { token, user } = response;

      await SecureStore.setItemAsync('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));

      setAuthToken(token);
      setUser(user);
      navigate('Main');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.error || 'Registration failed. Try again.',
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('🚪 Logging out...');
      await SecureStore.deleteItemAsync('authToken');
      await AsyncStorage.removeItem('user');
      setAuthToken(null);
      setUser(null);
      navigate('Auth');
    } catch (error) {
      console.error('❌ Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        authToken,
        isLoading,
        login,
        register,
        logout,
        checkLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
