import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from '../services/supplierService';

const SupplierScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // FETCH SUPPLIERS
  // ==========================================

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await getSuppliers();

      console.log('Suppliers response:', data);

      if (Array.isArray(data)) {
        setSuppliers(data);
      } else if (Array.isArray(data?.suppliers)) {
        setSuppliers(data.suppliers);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error(
        'Fetch suppliers error:',
        error.response?.data || error.message,
      );

      if (error.response?.status === 401) {
        Alert.alert(
          'Authentication Error',
          'Your login session has expired. Please login again.',
        );
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message ||
            'Unable to load suppliers.',
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
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.phone.trim() ||
      !formData.email.trim() ||
      !formData.address.trim()
    ) {
      Alert.alert(
        'Error',
        'Please fill out all required fields.',
      );
      return;
    }

    setLoading(true);

    try {
      const supplierData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
      };

      let response;

      // UPDATE
      if (editingId) {
        console.log(
          `PUT /api/supplier/${editingId}`,
        );

        response = await updateSupplier(
          editingId,
          supplierData,
        );
      }

      // CREATE
      else {
        console.log('POST /api/supplier');

        response = await createSupplier(
          supplierData,
        );
      }

      console.log(
        'Supplier response:',
        response,
      );

      Alert.alert(
        'Success',
        response?.message ||
          (editingId
            ? 'Supplier updated successfully.'
            : 'Supplier created successfully.'),
      );

      resetForm();

      await fetchSuppliers();
    } catch (error) {
      console.log(
        '==============================',
      );

      console.log(
        'SUPPLIER API ERROR',
      );

      console.log(
        'Message:',
        error.message,
      );

      console.log(
        'Status:',
        error.response?.status,
      );

      console.log(
        'Response:',
        error.response?.data,
      );

      console.log(
        '==============================',
      );

      if (error.response) {
        Alert.alert(
          `HTTP ${error.response.status}`,
          error.response?.data?.message ||
            error.response?.data?.error ||
            'Supplier operation failed.',
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
  // EDIT SUPPLIER
  // ==========================================

  const handleEdit = item => {
    const id = item._id || item.id;

    setEditingId(id);

    setFormData({
      name: item.name || '',
      phone: item.phone || '',
      email: item.email || '',
      address: item.address || '',
    });
  };

  // ==========================================
  // DELETE SUPPLIER
  // ==========================================

  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this supplier?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            setLoading(true);

            try {
              console.log(
                `DELETE /api/supplier/${id}`,
              );

              const response =
                await deleteSupplier(id);

              console.log(
                'Delete response:',
                response,
              );

              Alert.alert(
                'Success',
                response?.message ||
                  'Supplier deleted successfully.',
              );

              await fetchSuppliers();
            } catch (error) {
              console.error(
                'Delete supplier error:',
                error.response?.data ||
                  error.message,
              );

              if (error.response) {
                Alert.alert(
                  `HTTP ${error.response.status}`,
                  error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Failed to delete supplier.',
                );
              } else {
                Alert.alert(
                  'Network Error',
                  'Unable to connect to backend server.',
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

      <Text style={styles.heading}>
        {editingId
          ? 'Edit Supplier Record'
          : 'Add Supplier Details'}
      </Text>

      {/* SUPPLIER NAME */}

      <Text style={styles.label}>
        Supplier Name *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter supplier name"
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
        numberOfLines={3}
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
            ? 'Update Supplier'
            : 'Save Supplier'}
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
          Supplier Records from Database
        </Text>

        {suppliers.length === 0 ? (

          <Text style={styles.noRecordsText}>
            No records found.
          </Text>

        ) : (

          suppliers.map((item, index) => (

            <View
              key={item._id || item.id || index}
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
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: '#fafafa',
  },

  textArea: {
    height: 80,
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
    marginRight: 8,
  },

  recordTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  recordDetail: {
    fontSize: 13,
    color: '#666',
    marginTop: 3,
  },

  recordActions: {
    flexDirection: 'row',
  },

  editBtn: {
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 6,
  },

  deleteBtn: {
    backgroundColor: '#dc3545',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },

  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default SupplierScreen;