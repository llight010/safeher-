// src/contexts/EmergencyContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { Vibration } from 'react-native';
import * as Location from 'expo-location';
import axios from 'axios';
import { BASE_URL } from '../services/api'; // ✅ Correct relative path
import * as SecureStore from 'expo-secure-store';

const EmergencyContext = createContext();

export const EmergencyProvider = ({ children }) => {
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Permission to access location was denied');
      }
    })();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(coords);
      return coords;
    } catch (error) {
      setLocationError('Error getting location');
      console.error('📍 Location error:', error);
      return null;
    }
  };

  const triggerEmergency = async () => {
    const coords = await getCurrentLocation();
    if (!coords) return;

    const token = await SecureStore.getItemAsync('authToken');

    try {
      setIsEmergencyActive(true);
      Vibration.vibrate(500);

      const response = await axios.post(
        `${BASE_URL}/emergency`,
        {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('🚨 Emergency triggered:', response.data);
    } catch (error) {
      console.error('🚨 Error triggering emergency:', error);
    }
  };

  const cancelEmergency = () => {
    console.log('🚫 Emergency cancelled');
    Vibration.cancel();
    setIsEmergencyActive(false);
  };

  const resetEmergency = () => {
    setIsEmergencyActive(false);
    Vibration.cancel();
  };

  return (
    <EmergencyContext.Provider
      value={{
        isEmergencyActive,
        location,
        locationError,
        triggerEmergency,
        cancelEmergency,
        resetEmergency,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => useContext(EmergencyContext);
