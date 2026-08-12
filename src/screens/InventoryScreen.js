import React, {useEffect, useState} from 'react';
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
import {Picker} from '@react-native-picker/picker';

import api from '../api/api';

import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory,
} from '../services/inventoryService';

const InventoryScreen = () => {
  // ==========================================
  // FORM
  // ==========================================

  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    type: 'In',
    notes: '',
  });

  // ==========================================
  // STATE
  // ==========================================

  const [editingId, setEditingId] = useState(null);

  const [inventories, setInventories] = useState([]);

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [loadingProducts, setLoadingProducts] =
    useState(false);

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadData();
  }, []);

  // ==========================================
  // LOAD INVENTORY + PRODUCTS
  // ==========================================

  const loadData = async () => {
    await Promise.all([
      fetchInventories(),
      fetchProducts(),
    ]);
  };

  // ==========================================
  // GET INVENTORY
  // GET /api/inventory
  // ==========================================

  const fetchInventories = async () => {
    try {
      const data = await getInventory();

      console.log(
        'Inventory response:',
        data,
      );

      if (Array.isArray(data)) {
        setInventories(data);
      } else if (
        Array.isArray(data?.inventory)
      ) {
        setInventories(data.inventory);
      } else if (
        Array.isArray(data?.inventories)
      ) {
        setInventories(data.inventories);
      } else {
        setInventories([]);
      }
    } catch (error) {
      console.error(
        'Fetch inventory error:',
        error.response?.data ||
          error.message,
      );

      if (error.response?.status === 401) {
        Alert.alert(
          'Authentication Error',
          'Your login session has expired.',
        );
      } else {
        Alert.alert(
          'Error',
          error.response?.data?.message ||
            'Unable to load inventory records.',
        );
      }
    }
  };

  // ==========================================
  // GET PRODUCTS
  // GET /api/product
  // ==========================================

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);

      console.log(
        'GET /api/product',
      );

      const response = await api.get(
        '/product',
      );

      console.log(
        'Products response:',
        response.data,
      );

      let productData = [];

      if (Array.isArray(response.data)) {
        productData = response.data;
      } else if (
        Array.isArray(
          response.data?.products,
        )
      ) {
        productData =
          response.data.products;
      }

      setProducts(productData);
    } catch (error) {
      console.error(
        'Fetch products error:',
        error.response?.data ||
          error.message,
      );

      Alert.alert(
        'Product Error',
        error.response?.data?.message ||
          'Unable to load products.',
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (
    field,
    value,
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async () => {
    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!formData.product) {
      Alert.alert(
        'Error',
        'Please select a product.',
      );
      return;
    }

    if (
      !formData.quantity ||
      Number(formData.quantity) <= 0
    ) {
      Alert.alert(
        'Error',
        'Please enter a valid quantity.',
      );
      return;
    }

    if (!formData.type) {
      Alert.alert(
        'Error',
        'Please select movement type.',
      );
      return;
    }

    // ------------------------------------------
    // PAYLOAD
    // ------------------------------------------

    const payload = {
      product: formData.product,
      quantity: Number(
        formData.quantity,
      ),
      type: formData.type,
      notes: formData.notes.trim(),
    };

    console.log(
      'Inventory payload:',
      payload,
    );

    setLoading(true);

    try {
      let result;

      // ----------------------------------------
      // UPDATE
      // ----------------------------------------

      if (editingId) {
        console.log(
          `PUT /api/inventory/${editingId}`,
        );

        result =
          await updateInventory(
            editingId,
            payload,
          );
      }

      // ----------------------------------------
      // CREATE
      // ----------------------------------------

      else {
        console.log(
          'POST /api/inventory',
        );

        result =
          await createInventory(
            payload,
          );
      }

      console.log(
        'Inventory result:',
        result,
      );

      Alert.alert(
        'Success',
        result?.message ||
          (editingId
            ? 'Inventory updated successfully.'
            : 'Inventory created successfully.'),
      );

      resetForm();

      await fetchInventories();
    } catch (error) {
      console.error(
        'Inventory submit error:',
        error.response?.data ||
          error.message,
      );

      if (error.response) {
        Alert.alert(
          `HTTP ${error.response.status}`,
          error.response?.data
            ?.message ||
            error.response?.data
              ?.error ||
            'Inventory operation failed.',
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
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = item => {
    setEditingId(
      item._id || item.id,
    );

    // Product can be:
    // 1. ObjectId string
    // 2. Populated product object

    let productId = '';

    if (
      typeof item.product ===
        'object' &&
      item.product !== null
    ) {
      productId =
        item.product._id || '';
    } else {
      productId =
        item.product || '';
    }

    setFormData({
      product: productId,

      quantity:
        item.quantity !==
        undefined
          ? String(item.quantity)
          : '',

      type:
        item.type || 'In',

      notes:
        item.notes || '',
    });
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this inventory record?',
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
                `DELETE /api/inventory/${id}`,
              );

              const result =
                await deleteInventory(
                  id,
                );

              Alert.alert(
                'Success',
                result?.message ||
                  'Inventory record deleted successfully.',
              );

              await fetchInventories();
            } catch (error) {
              console.error(
                'Delete inventory error:',
                error.response?.data ||
                  error.message,
              );

              Alert.alert(
                'Error',
                error.response?.data
                  ?.message ||
                  'Failed to delete inventory record.',
              );
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

    setFormData({
      product: '',
      quantity: '',
      type: 'In',
      notes: '',
    });
  };

  // ==========================================
  // GET PRODUCT NAME
  // ==========================================

  const getProductName = product => {
    if (
      typeof product ===
        'object' &&
      product !== null
    ) {
      return (
        product.productName ||
        product.name ||
        product.sku ||
        'Unknown Product'
      );
    }

    const foundProduct =
      products.find(
        item =>
          item._id === product,
      );

    return (
      foundProduct?.productName ||
      foundProduct?.name ||
      foundProduct?.sku ||
      product ||
      'Unknown Product'
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <ScrollView
      contentContainerStyle={
        styles.container
      }
      keyboardShouldPersistTaps="handled">

      {/* ======================================
          HEADING
      ====================================== */}

      <Text style={styles.heading}>
        {editingId
          ? 'Edit Inventory Record'
          : 'Add Inventory Movement'}
      </Text>

      {/* ======================================
          PRODUCT
      ====================================== */}

      <Text style={styles.label}>
        Product *
      </Text>

      <View
        style={
          styles.pickerWrapper
        }>

        {loadingProducts ? (
          <View
            style={
              styles.loadingContainer
            }>

            <ActivityIndicator
              size="small"
            />

            <Text
              style={
                styles.loadingText
              }>
              Loading products...
            </Text>

          </View>
        ) : (
          <Picker
            selectedValue={
              formData.product
            }
            onValueChange={value =>
              handleChange(
                'product',
                value,
              )
            }
            enabled={!loading}>

            <Picker.Item
              label="Select Product"
              value=""
            />

            {products.map(
              product => (
                <Picker.Item
                  key={
                    product._id
                  }
                  label={
                    product.productName ||
                    product.name ||
                    product.sku ||
                    'Unnamed Product'
                  }
                  value={
                    product._id
                  }
                />
              ),
            )}

          </Picker>
        )}

      </View>

      {/* ======================================
          QUANTITY
      ====================================== */}

      <Text style={styles.label}>
        Quantity *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="numeric"
        value={
          formData.quantity
        }
        onChangeText={text =>
          handleChange(
            'quantity',
            text.replace(
              /[^0-9]/g,
              '',
            ),
          )
        }
        editable={!loading}
      />

      {/* ======================================
          MOVEMENT TYPE
      ====================================== */}

      <Text style={styles.label}>
        Movement Type *
      </Text>

      <View
        style={
          styles.typeContainer
        }>

        {/* STOCK IN */}

        <TouchableOpacity
          style={[
            styles.typeButton,
            formData.type ===
              'In' &&
              styles.typeButtonActiveIn,
          ]}
          onPress={() =>
            handleChange(
              'type',
              'In',
            )
          }
          disabled={loading}>

          <Text
            style={[
              styles.typeButtonText,
              formData.type ===
                'In' &&
                styles.typeButtonTextActive,
            ]}>
            Stock In
          </Text>

        </TouchableOpacity>

        {/* STOCK OUT */}

        <TouchableOpacity
          style={[
            styles.typeButton,
            formData.type ===
              'Out' &&
              styles.typeButtonActiveOut,
          ]}
          onPress={() =>
            handleChange(
              'type',
              'Out',
            )
          }
          disabled={loading}>

          <Text
            style={[
              styles.typeButtonText,
              formData.type ===
                'Out' &&
                styles.typeButtonTextActive,
            ]}>
            Stock Out
          </Text>

        </TouchableOpacity>

      </View>

      {/* ======================================
          NOTES
      ====================================== */}

      <Text style={styles.label}>
        Notes
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
        ]}
        placeholder="Add any additional notes..."
        multiline
        numberOfLines={3}
        value={formData.notes}
        onChangeText={text =>
          handleChange(
            'notes',
            text,
          )
        }
        editable={!loading}
      />

      {/* ======================================
          SAVE
      ====================================== */}

      <TouchableOpacity
        style={[
          styles.submitButton,
          loading &&
            styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={loading}>

        {loading ? (
          <ActivityIndicator
            color="#fff"
          />
        ) : (
          <Text
            style={
              styles.submitButtonText
            }>
            {editingId
              ? 'Update Inventory'
              : 'Save Inventory'}
          </Text>
        )}

      </TouchableOpacity>

      {/* ======================================
          CANCEL
      ====================================== */}

      {editingId && (
        <TouchableOpacity
          style={
            styles.cancelButton
          }
          onPress={resetForm}
          disabled={loading}>

          <Text
            style={
              styles.cancelButtonText
            }>
            Cancel Edit
          </Text>

        </TouchableOpacity>
      )}

      {/* ======================================
          RECORDS
      ====================================== */}

      <View
        style={
          styles.recordsSection
        }>

        <Text
          style={
            styles.subHeading
          }>
          Inventory Records from Database
        </Text>

        {inventories.length ===
        0 ? (
          <Text
            style={
              styles.noRecordsText
            }>
            No records found.
          </Text>
        ) : (
          inventories.map(
            (item, index) => {

              const id =
                item._id ||
                item.id;

              return (
                <View
                  key={
                    id || index
                  }
                  style={
                    styles.recordCard
                  }>

                  <View
                    style={
                      styles.recordInfo
                    }>

                    <Text
                      style={
                        styles.recordTitle
                      }>

                      {getProductName(
                        item.product,
                      )}

                    </Text>

                    <Text
                      style={
                        styles.recordDetail
                      }>

                      Type:{' '}

                      <Text
                        style={
                          item.type ===
                          'In'
                            ? styles.textIn
                            : styles.textOut
                        }>

                        {item.type ===
                        'In'
                          ? 'Stock In'
                          : 'Stock Out'}

                      </Text>

                      {'  '}| Qty:{' '}
                      {item.quantity}

                    </Text>

                    <Text
                      style={
                        styles.recordDetail
                      }>

                      Product ID:{' '}

                      {typeof item.product ===
                      'object'
                        ? item.product
                            ?._id
                        : item.product}

                    </Text>

                    {item.notes ? (
                      <Text
                        style={
                          styles.recordDetail
                        }>

                        Notes:{' '}
                        {item.notes}

                      </Text>
                    ) : null}

                  </View>

                  <View
                    style={
                      styles.recordActions
                    }>

                    <TouchableOpacity
                      style={
                        styles.editBtn
                      }
                      onPress={() =>
                        handleEdit(
                          item,
                        )
                      }
                      disabled={
                        loading
                      }>

                      <Text
                        style={
                          styles.actionText
                        }>
                        Edit
                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        styles.deleteBtn
                      }
                      onPress={() =>
                        handleDelete(
                          id,
                        )
                      }
                      disabled={
                        loading
                      }>

                      <Text
                        style={
                          styles.actionText
                        }>
                        Delete
                      </Text>

                    </TouchableOpacity>

                  </View>

                </View>
              );
            },
          )
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
    marginBottom: 16,
    marginTop: 33,
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

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    marginBottom: 14,
    overflow: 'hidden',
  },

  loadingContainer: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  loadingText: {
    marginLeft: 10,
    color: '#666',
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  typeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  typeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginHorizontal: 4,
  },

  typeButtonActiveIn: {
    backgroundColor: '#28a745',
    borderColor: '#28a745',
  },

  typeButtonActiveOut: {
    backgroundColor: '#dc3545',
    borderColor: '#dc3545',
  },

  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },

  typeButtonTextActive: {
    color: '#fff',
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

  textIn: {
    color: '#28a745',
    fontWeight: 'bold',
  },

  textOut: {
    color: '#dc3545',
    fontWeight: 'bold',
  },

  recordActions: {
    flexDirection: 'row',
    marginLeft: 8,
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

export default InventoryScreen; 