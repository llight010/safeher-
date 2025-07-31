import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import EmergencyActiveScreen from '../screens/EmergencyActiveScreen';
import ContactsScreen from '../screens/ContactsScreen';
import FakeCallScreen from '../screens/FakeCallScreen';
import SafetyTipsScreen from '../screens/SafetyTipsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddContactScreen from '../screens/AddContactScreen';

const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ff4081',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 65 + insets.bottom,
          paddingBottom: insets.bottom + 10,
          paddingTop: 5,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home': iconName = 'home'; break;
            case 'EmergencyScreen': iconName = 'alert-circle'; break;
            case 'Contacts': iconName = 'people'; break;
            case 'Fake Call': iconName = 'call'; break;
            case 'Safety Tips': iconName = 'shield-checkmark'; break;
            case 'Settings': iconName = 'settings'; break;
            case 'AddContact': iconName = 'person-add'; break;
            default: iconName = 'apps';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="EmergencyScreen" component={EmergencyActiveScreen} />
      <Tab.Screen name="Contacts" component={ContactsScreen} />
      <Tab.Screen name="Fake Call" component={FakeCallScreen} />
      <Tab.Screen name="Safety Tips" component={SafetyTipsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="AddContact" component={AddContactScreen} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
