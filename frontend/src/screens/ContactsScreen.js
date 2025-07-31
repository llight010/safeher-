import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { getContacts, deleteContact } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const ContactsScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setRefreshing(true);
    try {
      const contactsData = await getContacts();
      setContacts(contactsData);
    } catch (error) {
      console.error('Error loading contacts', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddContact = () => {
    navigation.navigate('AddContact');
  };

  const confirmDelete = (contactId) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to delete this contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => handleDelete(contactId),
          style: 'destructive',
        },
      ]
    );
  };

  const handleDelete = async (contactId) => {
    try {
      await deleteContact(contactId);
      setContacts(contacts.filter((c) => c.id !== contactId));
    } catch (error) {
      console.error('Error deleting contact', error);
    }
  };

  const renderContact = ({ item }) => (
    <View style={[styles.contactCard, { backgroundColor: theme.cardBackground }]}>
      <Ionicons name="person-circle-outline" size={32} color={theme.primary} />
      <View style={styles.contactText}>
        <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.phone, { color: theme.secondaryText }]}>{item.phone}</Text>
      </View>
      <TouchableOpacity
        onPress={() => confirmDelete(item.id)}
        style={styles.deleteIcon}
      >
        <Ionicons name="trash-outline" size={24} color={theme.emergency} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>👥 Emergency Contacts</Text>
        <TouchableOpacity onPress={handleAddContact}>
          <Ionicons name="add-circle" size={32} color={theme.primary} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.subtitle, { color: theme.secondaryText }]}>
        Contacts notified during emergencies
      </Text>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={loadContacts}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="people-outline" size={60} color={theme.secondaryText} />
            <Text style={[styles.emptyText, { color: theme.secondaryText }]}>
              No contacts added yet
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 30,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 1,
  },
  contactText: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  phone: {
    fontSize: 14,
    marginTop: 2,
  },
  deleteIcon: {
    padding: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default ContactsScreen;
