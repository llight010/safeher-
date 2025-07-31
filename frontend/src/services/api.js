import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// ✅ Replace with your local IP if testing on device
export const BASE_URL = 'http://192.168.31.66:5000'; // Do not use https for local dev

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Interceptor to add token to every request
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ------------ AUTH ---------------- */
export const registerUser = async (data) => {
  try {
    const response = await api.post('/register', data);
    return response.data;
  } catch (error) {
    console.error('❌ Registration error:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const response = await api.post('/login', data);
    return response.data;
  } catch (error) {
    console.error('🚨 Login error:', error.response?.data || error.message);
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const response = await api.get('/validate-token');
    return response.data;
  } catch (error) {
    console.error('❌ Token validation error:', error.response?.data || error.message);
    return { valid: false };
  }
};

/* ------------ CONTACTS ---------------- */
export const getContacts = async () => {
  try {
    const response = await api.get('/contacts');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching contacts:', error.response?.data || error.message);
    throw error;
  }
};

export const addContact = async (contact) => {
  try {
    const response = await api.post('/contacts', contact);
    return response.data;
  } catch (error) {
    console.error('❌ Error adding contact:', error.response?.data || error.message);
    throw error;
  }
};

export const updateContact = async (id, contact) => {
  try {
    const response = await api.put(`/contacts/${id}`, contact);
    return response.data;
  } catch (error) {
    console.error('❌ Error updating contact:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    await api.delete(`/contacts/${id}`);
  } catch (error) {
    console.error('❌ Error deleting contact:', error.response?.data || error.message);
    throw error;
  }
};

/* ------------ EMERGENCY ---------------- */
export const triggerEmergency = async (location) => {
  try {
    const response = await api.post('/emergency', {
      latitude: location.latitude,
      longitude: location.longitude,
    });
    return response.data;
  } catch (error) {
    console.error('❌ Error triggering emergency:', error.response?.data || error.message);
    throw error;
  }
};

/* ------------ SAFETY TIPS ---------------- */
export const getSafetyTips = async () => {
  try {
    const response = await api.get('/safety-tips');
    return response.data;
  } catch (error) {
    console.error('❌ Error fetching safety tips:', error.response?.data || error.message);
    return [];
  }
};
