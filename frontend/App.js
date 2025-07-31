import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { navigationRef } from './src/navigation/NavigationService';

// Context providers
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { EmergencyProvider } from './src/contexts/EmergencyContext';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainNavigator from './src/navigation/MainNavigator';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
    <ThemeProvider>
      <AuthProvider>
        <EmergencyProvider>
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
              initialRouteName="Splash"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Auth" component={AuthStack} />
              <Stack.Screen name="Main" component={MainNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </EmergencyProvider>
      </AuthProvider>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}

// AuthStack for login/register
const AuthStack = () => {
  const AuthStackNav = createNativeStackNavigator();
  return (
    <AuthStackNav.Navigator screenOptions={{ headerShown: false }}>
      <AuthStackNav.Screen name="Login" component={LoginScreen} />
      <AuthStackNav.Screen name="Register" component={RegisterScreen} />
    </AuthStackNav.Navigator>
  );
};
