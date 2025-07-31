import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

const ActionButton = ({ icon, label, onPress }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.button, { backgroundColor: theme.cardBackground }]}>
        <Ionicons name={icon} size={30} color={theme.primary} />
        <Text style={[styles.label, { color: theme.text }]}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ActionButton;