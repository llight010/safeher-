import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

const SplashScreen = () => {
  const navigation = useNavigation();
  const { isLoading, user } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    let timeout;
    if (!isLoading) {
      timeout = setTimeout(() => {
        navigation.replace(user ? 'Main' : 'Auth');
      }, 1500); // shorter splash for responsiveness
    }

    return () => clearTimeout(timeout);
  }, [isLoading, user]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LottieView
        source={require('../../assets/animations/splash.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={[styles.title, { color: theme.text }]}>SafeHer</Text>
      <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
        Your Safety Companion
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 300,
    height: 300,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
});

export default SplashScreen;
