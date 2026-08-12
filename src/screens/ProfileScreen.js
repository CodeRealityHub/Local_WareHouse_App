import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserProfile, updateUserProfile, getAllUsers } from '../services/userService';

const ProfileScreen = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [usersList, setUsersList] = useState([]);
  const [showUsersList, setShowUsersList] = useState(false);

  useEffect(() => {
    loadProfileData();
    loadAllUsers();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      // Fetch user profile using the user service (which attaches token automatically via axios interceptor or headers)
      const data = await getUserProfile();

      setFormData({
        name: data.name || '',
        email: data.email || '',
        password: '',
        role: data.role || 'User',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to load user profile');
    } finally {
      setLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsersList(Array.isArray(data) ? data : (data.users || []));
    } catch (error) {
      console.error('Error fetching users list:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleUpdateProfile = async () => {
    if (!formData.name || !formData.email) {
      Alert.alert('Error', 'Name and Email fields are required.');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
      };

      if (formData.password && formData.password.trim() !== '') {
        payload.password = formData.password;
      }

      await updateUserProfile(payload);

      Alert.alert('Success', 'Profile updated successfully!');
      setFormData((prev) => ({ ...prev, password: '' }));
      loadProfileData();
      loadAllUsers();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Account Profile</Text>

      <Text style={styles.label}>Full Name *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#888"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <Text style={styles.label}>Email Address *</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#888"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <Text style={styles.label}>New Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Leave blank to keep current password"
        placeholderTextColor="#888"
        secureTextEntry
        value={formData.password}
        onChangeText={(text) => handleChange('password', text)}
      />

      <Text style={styles.label}>System Role</Text>
      <TextInput
        style={[styles.input, styles.disabledInput]}
        placeholder="Role"
        placeholderTextColor="#888"
        value={formData.role}
        editable={false}
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleUpdateProfile}>
        <Text style={styles.submitButtonText}>Update Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowUsersList(!showUsersList)}
      >
        <Text style={styles.toggleButtonText}>
          {showUsersList ? 'Hide Users Database Records' : 'View All Users Records'}
        </Text>
      </TouchableOpacity>

      {showUsersList && (
        <View style={styles.recordsSection}>
          <Text style={styles.subHeading}>Registered Users Database</Text>
          {usersList.length === 0 ? (
            <Text style={styles.noDataText}>No user records found.</Text>
          ) : (
            usersList.map((usr) => (
              <View key={usr._id || usr.id} style={styles.recordCard}>
                <View>
                  <Text style={styles.recordTitle}>{usr.name}</Text>
                  <Text style={styles.recordDetail}>Email: {usr.email}</Text>
                </View>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleBadgeText}>{usr.role || 'User'}</Text>
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flexGrow: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  heading: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginBottom: 20, marginTop: 40, color: '#333' },
  subHeading: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#495057' },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, color: '#555' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, marginBottom: 16, backgroundColor: '#fafafa', color: '#000' },
  disabledInput: { backgroundColor: '#e9ecef', color: '#6c757d' },
  submitButton: { backgroundColor: '#007AFF', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  toggleButton: { backgroundColor: '#6c757d', borderRadius: 8, paddingVertical: 12, alignItems: 'center', marginTop: 12, marginBottom: 20 },
  toggleButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  recordsSection: { backgroundColor: '#f8f9fa', borderRadius: 12, padding: 12, marginBottom: 30, borderWidth: 1, borderColor: '#e9ecef' },
  noDataText: { color: '#666', fontStyle: 'italic', fontSize: 13 },
  recordCard: { backgroundColor: '#fff', borderRadius: 8, padding: 12, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#dee2e6' },
  recordTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  recordDetail: { fontSize: 13, color: '#666', marginTop: 2 },
  roleBadge: { backgroundColor: '#e7f1ff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  roleBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#007AFF' },
});

export default ProfileScreen;