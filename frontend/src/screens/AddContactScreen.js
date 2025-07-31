import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { addContact } from '../services/api';
import LottieView from 'lottie-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const AddContactScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name || !phone) {
      setError('Name and phone are required');
      return;
    }

    try {
      await addContact({
        name,
        phone,
        email,
        relationship,
        is_primary: isPrimary,
      });
      navigation.goBack();
    } catch (err) {
      setError('Failed to add contact');
    }
  };

  return (
    <LinearGradient
      colors={
        theme.mode === 'dark'
          ? ['#0f0f0f', '#1e1e1e']
          : ['#e0f7fa', '#ffffff']
      }
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={[styles.card, { backgroundColor: theme.cardBackground, shadowColor: theme.text }]}>
            <LottieView
              source={require('../../assets/animations/contact-book.json')}
              autoPlay
              loop
              style={styles.lottie}
            />

            <Text style={[styles.title, { color: theme.text }]}>
              Add New Contact
            </Text>

            {error ? (
              <Text style={[styles.errorText, { color: theme.emergency }]}>
                {error}
              </Text>
            ) : null}

            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholder="Full Name"
              placeholderTextColor={theme.secondaryText}
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholder="Phone Number"
              placeholderTextColor={theme.secondaryText}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholder="Email (Optional)"
              placeholderTextColor={theme.secondaryText}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.input, color: theme.text }]}
              placeholder="Relationship (Optional)"
              placeholderTextColor={theme.secondaryText}
              value={relationship}
              onChangeText={setRelationship}
            />

            <TouchableOpacity
              style={[
                styles.primaryToggle,
                {
                  backgroundColor: isPrimary ? theme.primary : theme.cardBackground,
                  borderColor: theme.primary,
                },
              ]}
              onPress={() => setIsPrimary(!isPrimary)}
            >
              <Text style={{ color: isPrimary ? '#fff' : theme.text }}>
                {isPrimary ? '✓ Primary Contact' : 'Set as Primary Contact'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, { backgroundColor: theme.primary }]}
              onPress={handleSave}
            >
              <Text style={styles.saveButtonText}>Save Contact</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    padding: 25,
    borderRadius: 20,
    elevation: 8,
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  primaryToggle: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveButton: {
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  lottie: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 10,
  },
});

export default AddContactScreen;
