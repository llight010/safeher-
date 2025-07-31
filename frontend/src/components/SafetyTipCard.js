import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

const SafetyTipCard = ({ tip }) => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
      <Text style={[styles.title, { color: theme.primary }]}>{tip.title}</Text>
      <Text style={[styles.content, { color: theme.text }]}>{tip.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default SafetyTipCard;