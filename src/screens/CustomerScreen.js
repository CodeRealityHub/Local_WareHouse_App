import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import api from '../api/api';

const CustomerScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ==========================================
  // GET CUSTOMERS
  // GET /api/customer
  // ==========================================

  const fetchCustomers = async () => {
    try {
      console.log('GET /api/customer');

      const response = await api.get('/customer');

      console.log('Customers response:', response.data);

      if (Array.isArray(response.data)) {
        setCustomers(response.data);
      } else if (Array.isArray(response.data?.customers)) {
        setCustomers(response.data.customers);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.log('================================');
      console.log('GET CUSTOMER ERROR');
      console.log('Message:', error.message);
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('================================');

      if (error.response) {
        Alert.alert(
          `HTTP ${error.response.status}`,
          error.response?.data?.message ||
            error.response?.data?.error ||
            'Unable to load customers.',
        );
      } else {
        Alert.alert(
          'Network Error',
          'Unable to connect to the backend server.',
        );
      }
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // CREATE / UPDATE CUSTOMER
  // ==========================================

  const handleSubmit = async () => {
    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const email = formData.email.trim();
    const address = formData.address.trim();

    // ========================================
    // VALIDATION
    // ========================================

    if (!name) {
      Alert.alert('Error', 'Customer name is required.');
      return;
    }

    if (!phone) {
      Alert.alert('Error', 'Phone number is required.');
      return;
    }

    if (!email) {
      Alert.alert('Error', 'Email is required.');
      return;
    }

    if (!address) {
      Alert.alert('Error', 'Address is required.');
      return;
    }

    const customerData = {
      name,
      phone,
      email,
      address,
    };

    setLoading(true);

    try {
      let response;

      // ========================================
      // UPDATE
      // PUT /api/customer/:id
      // ========================================

      if (editingId) {
        console.log(
          `PUT /api/customer/${editingId}`,
        );

        response = await api.put(
          `/customer/${editingId}`,
          customerData,
        );
      }

      // ========================================
      // CREATE
      // POST /api/customer
      // ========================================

      else {
        console.log('POST /api/customer');

        response = await api.post(
          '/customer',
          customerData,
        );
      }

      console.log(
        'Customer response:',
        response.data,
      );

      Alert.alert(
        'Success',
        response.data?.message ||
          (editingId
            ? 'Customer updated successfully.'
            : 'Customer created successfully.'),
      );

      resetForm();

      await fetchCustomers();
    } catch (error) {
      console.log('================================');
      console.log('CUSTOMER API ERROR');
      console.log('Message:', error.message);
      console.log('Status:', error.response?.status);
      console.log('Data:', error.response?.data);
      console.log('================================');

      if (error.response) {
        Alert.alert(
          `HTTP ${error.response.status}`,
          error.response?.data?.message ||
            error.response?.data?.error ||
            JSON.stringify(error.response.data),
        );
      } else {
        Alert.alert(
          'Network Error',
          error.message ||
            'Unable to connect to backend server.',
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // EDIT CUSTOMER
  // ==========================================

  const handleEdit = item => {
    setEditingId(item._id || item.id);

    setFormData({
      name: item.name || '',
      phone: item.phone || '',
      email: item.email || '',
      address: item.address || '',
    });
  };

  // ==========================================
  // DELETE CUSTOMER
  // ==========================================

  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this customer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },

        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              setLoading(true);

              console.log(
                `DELETE /api/customer/${id}`,
              );

              const response =
                await api.delete(
                  `/customer/${id}`,
                );

              console.log(
                'Delete response:',
                response.data,
              );

              Alert.alert(
                'Success',
                response.data?.message ||
                  'Customer deleted successfully.',
              );

              await fetchCustomers();
            } catch (error) {
              console.log(
                'DELETE CUSTOMER ERROR:',
                error.response?.data ||
                  error.message,
              );

              if (error.response) {
                Alert.alert(
                  `HTTP ${error.response.status}`,
                  error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Failed to delete customer.',
                );
              } else {
                Alert.alert(
                  'Network Error',
                  'Unable to connect to the backend server.',
                );
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
    });
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">

      {/* HEADING */}

      <Text style={styles.heading}>
        {editingId
          ? 'Edit Customer Record'
          : 'Add Customer Details'}
      </Text>

      {/* NAME */}

      <Text style={styles.label}>
        Customer Name *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter customer name"
        value={formData.name}
        onChangeText={text =>
          handleChange('name', text)
        }
        editable={!loading}
      />

      {/* PHONE */}

      <Text style={styles.label}>
        Phone Number *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={text =>
          handleChange('phone', text)
        }
        editable={!loading}
      />

      {/* EMAIL */}

      <Text style={styles.label}>
        Email *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter email address"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={formData.email}
        onChangeText={text =>
          handleChange('email', text)
        }
        editable={!loading}
      />

      {/* ADDRESS */}

      <Text style={styles.label}>
        Address *
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
        ]}
        placeholder="Enter street address..."
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={formData.address}
        onChangeText={text =>
          handleChange('address', text)
        }
        editable={!loading}
      />

      {/* SAVE / UPDATE */}

      <TouchableOpacity
        style={[
          styles.submitButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={loading}>

        <Text style={styles.submitButtonText}>
          {loading
            ? 'Please wait...'
            : editingId
            ? 'Update Customer'
            : 'Save Customer'}
        </Text>
      </TouchableOpacity>

      {/* CANCEL EDIT */}

      {editingId && (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={resetForm}
          disabled={loading}>

          <Text style={styles.cancelButtonText}>
            Cancel Edit
          </Text>
        </TouchableOpacity>
      )}

      {/* DATABASE RECORDS */}

      <View style={styles.recordsSection}>

        <Text style={styles.subHeading}>
          Customer Records from Database
        </Text>

        {customers.length === 0 ? (

          <Text style={styles.noRecordsText}>
            No records found.
          </Text>

        ) : (

          customers.map((item, index) => (

            <View
              key={item._id || index}
              style={styles.recordCard}>

              <View style={styles.recordInfo}>

                <Text style={styles.recordTitle}>
                  {item.name}
                </Text>

                <Text style={styles.recordDetail}>
                  Phone: {item.phone}
                </Text>

                <Text style={styles.recordDetail}>
                  Email: {item.email}
                </Text>

                <Text style={styles.recordDetail}>
                  Address: {item.address}
                </Text>

              </View>

              <View style={styles.recordActions}>

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
                    handleEdit(item)
                  }
                  disabled={loading}>

                  <Text style={styles.actionText}>
                    Edit
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    handleDelete(
                      item._id || item.id,
                    )
                  }
                  disabled={loading}>

                  <Text style={styles.actionText}>
                    Delete
                  </Text>

                </TouchableOpacity>

              </View>

            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 33,
    marginBottom: 16,
    color: '#333',
  },

  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
    color: '#333',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },

  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  recordsSection: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
    paddingBottom: 40,
  },

  noRecordsText: {
    color: '#888',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 10,
  },

  recordCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },

  recordInfo: {
    flex: 1,
    paddingRight: 8,
  },

  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },

  recordDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },

  recordActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  editBtn: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    marginRight: 6,
  },

  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
  },

  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default CustomerScreen;