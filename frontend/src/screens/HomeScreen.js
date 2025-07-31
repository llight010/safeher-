import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { getCurrentLocation } from '../services/LocationService';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  const { theme, mode } = useTheme();
  const { user, logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const loc = await getCurrentLocation();
        setLocation(loc);
      } catch (err) {
        setErrorMsg(err.message || 'Could not get location');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <LinearGradient
      colors={mode === 'dark'
        ? ['#0f2027', '#203a43', '#2c5364']
        : ['#FFDEE9', '#B5FFFC']}
      style={styles.container}
    >
      <LinearGradient
        colors={mode === 'dark' ? ['#1f1c2c', '#928dab'] : ['#ffffff', '#f5f5f5']}
        style={[styles.card, { shadowColor: theme.text }]}
      >
        <LottieView
          source={require('../../assets/animations/location-pin.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
        <Text style={[styles.title, { color: theme.text }]}>
          Welcome, {user?.name || 'User'}!
        </Text>
        <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
          Your current location:
        </Text>

        {loading ? (
          <ActivityIndicator size="large" color={theme.primary} style={{ marginTop: 20 }} />
        ) : errorMsg ? (
          <Text style={[styles.errorText, { color: theme.emergency }]}>{errorMsg}</Text>
        ) : (
          <View style={styles.locationBox}>
            <Text style={[styles.locationText, { color: theme.text }]}>
              📍 Latitude: {location?.latitude}
            </Text>
            <Text style={[styles.locationText, { color: theme.text }]}>
              📍 Longitude: {location?.longitude}
            </Text>
          </View>
        )}

        <TouchableOpacity
          onPress={logout}
          style={[styles.logoutButton, { backgroundColor: theme.primary }]}
        >
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 10,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
  },
  lottie: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 14,
  },
  locationBox: {
    marginVertical: 10,
  },
  locationText: {
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default HomeScreen;
