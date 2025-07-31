import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const { theme, isDark, toggleTheme, mode } = useTheme();

  const sections = [
    {
      title: 'Appearance',
      items: [
        {
          label: 'Dark Mode',
          icon: 'moon-outline',
          renderRight: () => (
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: theme.primary }}
              thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
            />
          ),
        },
      ],
    },
    {
      title: 'Account',
      items: [
        { label: 'Change Password', icon: 'lock-closed-outline' },
        { label: 'Notification Settings', icon: 'notifications-outline' },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        { label: 'Privacy Policy', icon: 'shield-outline' },
        { label: 'Terms of Service', icon: 'document-text-outline' },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', icon: 'help-circle-outline' },
        { label: 'Contact Support', icon: 'mail-outline' },
      ],
    },
  ];

  return (
    <LinearGradient
      colors={mode === 'dark' ? ['#1f1c2c', '#928dab'] : ['#ffdde1', '#ee9ca7']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.text }]}>
          <LottieView
            source={require('../../assets/animations/settings.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
          <Text style={[styles.title, { color: theme.text }]}>Settings</Text>

          {sections.map((section, idx) => (
            <View key={idx} style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
              {section.items.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={[styles.settingItem, { backgroundColor: theme.background }]}
                  activeOpacity={0.7}
                >
                  <View style={styles.settingInfo}>
                    <Ionicons name={item.icon} size={24} color={theme.primary} />
                    <Text style={[styles.settingText, { color: theme.text }]}>{item.label}</Text>
                  </View>
                  {item.renderRight ? (
                    item.renderRight()
                  ) : (
                    <Ionicons name="chevron-forward" size={20} color={theme.secondaryText} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    padding: 25,
    borderRadius: 20,
    elevation: 6,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  lottie: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 15,
  },
});

export default SettingsScreen;
