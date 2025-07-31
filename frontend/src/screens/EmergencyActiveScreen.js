import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useEmergency } from '../contexts/EmergencyContext';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { LinearGradient } from 'expo-linear-gradient';
import { getCurrentLocation } from '../services/LocationService';
import { triggerEmergency } from '../services/api';


const { width } = Dimensions.get('window');

const EmergencyActiveScreen = () => {
  const { theme, mode } = useTheme();
  const { cancelEmergency, resetEmergency } = useEmergency();
  const navigation = useNavigation();

  const [fadeAnim] = useState(new Animated.Value(0));
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [alertMsg, setAlertMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // Animation fade-in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    // Get current location and trigger emergency alert
    (async () => {
      try {
        setLoading(true);
        const location = await getCurrentLocation();
        const response = await triggerEmergency(location);
        setAlertMsg(response.message || 'Emergency alert sent');
      } catch (error) {
        console.error('❌ Emergency error:', error);
        setErrorMsg(error?.response?.data?.error || 'Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleComplete = () => {
    resetEmergency();
    navigation.navigate('Home');
    return { shouldRepeat: false };
  };

  const cancelEmergencyHandler = () => {
    setIsPlaying(false);
    cancelEmergency();
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={mode === 'dark' ? ['#1e1e2f', '#3c3c5a'] : ['#fceabb', '#f8b500']}
      style={styles.gradient}
    >
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.text }]}>
          <LottieView
            source={require('../../assets/animations/emergency.json')}
            autoPlay
            loop
            style={styles.lottie}
          />

          <Text style={[styles.title, { color: theme.emergency }]}>EMERGENCY MODE</Text>

          {loading ? (
            <ActivityIndicator color={theme.emergency} size="large" style={{ marginTop: 20 }} />
          ) : errorMsg ? (
            <Text style={[styles.message, { color: theme.emergency }]}>{errorMsg}</Text>
          ) : (
            <Text style={[styles.message, { color: theme.secondaryText }]}>{alertMsg}</Text>
          )}

          <View style={styles.timerWrapper}>
            <CountdownCircleTimer
              isPlaying={isPlaying}
              duration={30}
              colors={[theme.emergency, '#FF6B6B', '#FF9E80']}
              colorsTime={[30, 15, 0]}
              size={140}
              strokeWidth={10}
              onComplete={handleComplete}
              key={isPlaying} // ensures timer resets when `isPlaying` changes
            >
              {({ remainingTime }) => (
                <Text style={[styles.timerText, { color: theme.emergency }]}>
                  {remainingTime}s
                </Text>
              )}
            </CountdownCircleTimer>
          </View>

          <TouchableOpacity
            onPress={cancelEmergencyHandler}
            style={[styles.cancelButton, { borderColor: theme.emergency }]}
          >
            <Text style={[styles.cancelText, { color: theme.emergency }]}>
              Cancel Emergency
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: width * 0.9,
    padding: 30,
    borderRadius: 22,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  lottie: {
    width: 180,
    height: 180,
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 28,
  },
  timerWrapper: {
    marginBottom: 25,
  },
  timerText: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  cancelButton: {
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },
  cancelText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EmergencyActiveScreen;
