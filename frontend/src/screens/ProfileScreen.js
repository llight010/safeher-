import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const ProfileScreen = ({ navigation }) => {
  const { theme, mode } = useTheme();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => logout();

  const menuItems = [
    { icon: 'person-outline', label: 'Edit Profile' },
    { icon: 'lock-closed-outline', label: 'Change Password' },
    { icon: 'notifications-outline', label: 'Notification Settings' },
    { icon: 'shield-checkmark-outline', label: 'Privacy & Security' },
  ];

  return (
    <LinearGradient
      colors={mode === 'dark'
        ? ['#0f2027', '#203a43', '#2c5364']
        : ['#fdfbfb', '#ebedee']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>Profile</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Ionicons name="settings-outline" size={24} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Lottie animation */}
        <LottieView
          source={require('../../assets/animations/profile-intro.json')}
          autoPlay
          loop={false}
          style={styles.lottie}
        />

        {/* User Card */}
        <LinearGradient
          colors={mode === 'dark' ? ['#232526', '#414345'] : ['#ffffff', '#f3f3f3']}
          style={[styles.card, { shadowColor: theme.text }]}
        >
          <View style={[styles.avatar, { backgroundColor: theme.border }]}>
            <Ionicons name="person" size={40} color={theme.primary} />
          </View>

          {loading ? (
            <>
              <ShimmerPlaceHolder
                style={styles.shimmerLine}
                shimmerColors={mode === 'dark'
                  ? ['#2c3e50', '#4ca1af', '#2c3e50']
                  : ['#f6f7f8', '#edeef1', '#f6f7f8']}
              />
              <ShimmerPlaceHolder style={[styles.shimmerLine, { width: 180 }]} />
              <ShimmerPlaceHolder style={[styles.shimmerLine, { width: 160 }]} />
            </>
          ) : (
            <>
              <Text style={[styles.name, { color: theme.text }]}>{user?.name}</Text>
              <Text style={[styles.email, { color: theme.secondaryText }]}>{user?.email}</Text>
              <Text style={[styles.phone, { color: theme.secondaryText }]}>{user?.phone}</Text>
            </>
          )}
        </LinearGradient>

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Ionicons name={item.icon} size={22} color={theme.icon} />
              <Text style={[styles.menuText, { color: theme.text }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={[styles.logoutButton, {
            backgroundColor: theme.cardBackground,
            borderColor: theme.emergency,
          }]}
        >
          <Text style={[styles.logoutText, { color: theme.emergency }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  lottie: {
    height: 120,
    alignSelf: 'center',
    marginBottom: 10,
  },
  card: {
    width: width * 0.9,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 5,
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 16,
    marginTop: 4,
  },
  phone: {
    fontSize: 16,
    marginTop: 2,
  },
  shimmerLine: {
    height: 20,
    borderRadius: 6,
    marginTop: 8,
    width: 140,
  },
  menu: {
    marginBottom: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginTop: 20,
  },
  logoutText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
