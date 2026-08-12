import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';

const CategoryScreen = () => {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // FETCH CATEGORIES
  // ==========================================

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('GET /api/category');

      const data = await getCategories();

      console.log('Categories response:', data);

      if (Array.isArray(data)) {
        setCategories(data);
      } else if (Array.isArray(data?.categories)) {
        setCategories(data.categories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error(
        'Fetch categories error:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Unable to load categories.',
      );
    }
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async () => {
    const name = categoryName.trim();

    if (!name) {
      Alert.alert(
        'Error',
        'Please enter category name.',
      );
      return;
    }

    setLoading(true);

    try {
      const categoryData = {
        name: name,
      };

      let response;

      // UPDATE
      if (editingId) {
        console.log(
          `PUT /api/category/${editingId}`,
        );

        response = await updateCategory(
          editingId,
          categoryData,
        );
      }

      // CREATE
      else {
        console.log('POST /api/category');

        response = await createCategory(
          categoryData,
        );
      }

      console.log(
        'Category response:',
        response,
      );

      Alert.alert(
        'Success',
        response?.message ||
          (editingId
            ? 'Category updated successfully.'
            : 'Category created successfully.'),
      );

      resetForm();

      await fetchCategories();
    } catch (error) {
      console.log(
        '==============================',
      );

      console.log('CATEGORY API ERROR');

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
            'Category operation failed.',
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
  // EDIT
  // ==========================================

  const handleEdit = item => {
    const id = item._id || item.id;

    setEditingId(id);

    setCategoryName(
      item.name ||
        item.categoryName ||
        item.title ||
        '',
    );
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this category?',
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
                `DELETE /api/category/${id}`,
              );

              const response =
                await deleteCategory(id);

              console.log(
                'Delete response:',
                response,
              );

              Alert.alert(
                'Success',
                response?.message ||
                  'Category deleted successfully.',
              );

              await fetchCategories();
            } catch (error) {
              console.error(
                'Delete category error:',
                error.response?.data ||
                  error.message,
              );

              if (error.response) {
                Alert.alert(
                  `HTTP ${error.response.status}`,
                  error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Failed to delete category.',
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
  // RESET
  // ==========================================

  const resetForm = () => {
    setEditingId(null);
    setCategoryName('');
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
          ? 'Edit Category Record'
          : 'Add Category Details'}
      </Text>

      {/* CATEGORY NAME */}

      <Text style={styles.label}>
        Category Name *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter category name"
        value={categoryName}
        onChangeText={setCategoryName}
        editable={!loading}
      />

      {/* SAVE */}

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
            ? 'Update Category'
            : 'Save Category'}
        </Text>

      </TouchableOpacity>

      {/* CANCEL */}

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
          Category Records from Database
        </Text>

        {categories.length === 0 ? (

          <Text style={styles.noRecordsText}>
            No records found.
          </Text>

        ) : (

          categories.map((item, index) => {

            const id =
              item._id || item.id;

            const name =
              item.name ||
              item.categoryName ||
              item.title ||
              'Unnamed Category';

            return (
              <View
                key={id || index}
                style={styles.recordCard}>

                <View
                  style={styles.recordInfo}>

                  <Text
                    style={styles.recordTitle}>
                    {name}
                  </Text>

                  <Text
                    style={styles.recordDetail}>
                    ID: {id}
                  </Text>

                </View>

                <View
                  style={styles.recordActions}>

                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() =>
                      handleEdit(item)
                    }
                    disabled={loading}>

                    <Text
                      style={styles.actionText}>
                      Edit
                    </Text>

                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() =>
                      handleDelete(id)
                    }
                    disabled={loading}>

                    <Text
                      style={styles.actionText}>
                      Delete
                    </Text>

                  </TouchableOpacity>

                </View>

              </View>
            );
          })
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
    fontSize: 12,
    color: '#888',
    marginTop: 4,
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

export default CategoryScreen;