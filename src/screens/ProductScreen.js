import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';

import api from '../api/api';

const ProductScreen = () => {
  const [formData, setFormData] = useState({
    productName: '',
    sku: '',
    barcode: '',
    category: '',
    supplier: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '0',
    description: '',
    status: 'Active',
    image: null,
  });

  const [editingId, setEditingId] = useState(null);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setLoadingData(true);

    try {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchSuppliers(),
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  // =====================================================
  // GET PRODUCTS
  // GET /api/product
  // =====================================================

  const fetchProducts = async () => {
    try {
      console.log('GET /api/product');

      const response = await api.get('/product');

      console.log('PRODUCTS RESPONSE:', response.data);

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (Array.isArray(response.data?.products)) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.log(
        'GET PRODUCTS ERROR:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Product Error',
        getErrorMessage(error, 'Unable to load products.'),
      );
    }
  };

  // =====================================================
  // GET CATEGORIES
  // GET /api/category
  // =====================================================

  const fetchCategories = async () => {
    try {
      console.log('GET /api/category');

      const response = await api.get('/category');

      console.log('CATEGORIES RESPONSE:', response.data);

      let categoryData = [];

      if (Array.isArray(response.data)) {
        categoryData = response.data;
      } else if (Array.isArray(response.data?.categories)) {
        categoryData = response.data.categories;
      } else if (Array.isArray(response.data?.data)) {
        categoryData = response.data.data;
      }

      console.log('CATEGORY LIST:', categoryData);

      setCategories(categoryData);
    } catch (error) {
      console.log(
        'GET CATEGORIES ERROR:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Category Error',
        getErrorMessage(error, 'Unable to load categories.'),
      );
    }
  };

  // =====================================================
  // GET SUPPLIERS
  // GET /api/supplier
  // =====================================================

  const fetchSuppliers = async () => {
    try {
      console.log('GET /api/supplier');

      const response = await api.get('/supplier');

      console.log('SUPPLIERS RESPONSE:', response.data);

      let supplierData = [];

      if (Array.isArray(response.data)) {
        supplierData = response.data;
      } else if (Array.isArray(response.data?.suppliers)) {
        supplierData = response.data.suppliers;
      } else if (Array.isArray(response.data?.data)) {
        supplierData = response.data.data;
      }

      console.log('SUPPLIER LIST:', supplierData);

      setSuppliers(supplierData);
    } catch (error) {
      console.log(
        'GET SUPPLIERS ERROR:',
        error.response?.data || error.message,
      );

      Alert.alert(
        'Supplier Error',
        getErrorMessage(error, 'Unable to load suppliers.'),
      );
    }
  };

  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;

    if (data?.message) {
      return data.message;
    }

    if (data?.error) {
      return data.error;
    }

    if (typeof data === 'string') {
      return data;
    }

    return error?.message || fallback;
  };

  // =====================================================
  // INPUT
  // =====================================================

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // =====================================================
  // IMAGE PICKER
  // =====================================================

  const handlePickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        selectionLimit: 1,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert(
            'Image Error',
            response.errorMessage || 'Unable to select image.',
          );
          return;
        }

        if (response.assets?.length > 0) {
          handleChange('image', response.assets[0]);
        }
      },
    );
  };

  // =====================================================
  // CREATE / UPDATE PRODUCT
  // =====================================================

  const handleSubmit = async () => {
    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!formData.productName.trim()) {
      Alert.alert('Error', 'Product name is required.');
      return;
    }

    if (!formData.sku.trim()) {
      Alert.alert('Error', 'SKU is required.');
      return;
    }

    if (!formData.barcode.trim()) {
      Alert.alert('Error', 'Barcode is required.');
      return;
    }

    if (!formData.category) {
      Alert.alert('Error', 'Please select a category.');
      return;
    }

    if (!formData.supplier) {
      Alert.alert('Error', 'Please select a supplier.');
      return;
    }

    if (!formData.purchasePrice.trim()) {
      Alert.alert('Error', 'Purchase price is required.');
      return;
    }

    if (!formData.sellingPrice.trim()) {
      Alert.alert('Error', 'Selling price is required.');
      return;
    }

    // =================================================
    // FORM DATA
    // =================================================

    const data = new FormData();

    data.append(
      'productName',
      formData.productName.trim(),
    );

    data.append(
      'sku',
      formData.sku.trim(),
    );

    data.append(
      'barcode',
      formData.barcode.trim(),
    );

    // IMPORTANT:
    // category contains MongoDB ObjectId
    data.append(
      'category',
      String(formData.category),
    );

    // IMPORTANT:
    // supplier contains MongoDB ObjectId
    data.append(
      'supplier',
      String(formData.supplier),
    );

    data.append(
      'purchasePrice',
      String(formData.purchasePrice.trim()),
    );

    data.append(
      'sellingPrice',
      String(formData.sellingPrice.trim()),
    );

    data.append(
      'quantity',
      String(formData.quantity || '0'),
    );

    data.append(
      'description',
      formData.description?.trim() || '',
    );

    data.append(
      'status',
      formData.status || 'Active',
    );

    // =================================================
    // IMAGE
    // =================================================

    if (formData.image?.uri) {
      data.append('image', {
        uri: formData.image.uri,
        name:
          formData.image.fileName ||
          `product_${Date.now()}.jpg`,
        type:
          formData.image.type ||
          'image/jpeg',
      });
    }

    // =================================================
    // DEBUG
    // =================================================

    console.log('================================');
    console.log('PRODUCT SUBMIT');
    console.log('================================');
    console.log(
      'productName:',
      formData.productName,
    );
    console.log('sku:', formData.sku);
    console.log('barcode:', formData.barcode);
    console.log('category:', formData.category);
    console.log('supplier:', formData.supplier);
    console.log(
      'purchasePrice:',
      formData.purchasePrice,
    );
    console.log(
      'sellingPrice:',
      formData.sellingPrice,
    );
    console.log(
      'quantity:',
      formData.quantity,
    );
    console.log('status:', formData.status);
    console.log(
      'image:',
      formData.image?.uri || 'No image',
    );
    console.log('================================');

    setLoading(true);

    try {
      let response;

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        console.log(
          `PUT /api/product/${editingId}`,
        );

        response = await api.put(
          `/product/${editingId}`,
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            transformRequest: value => value,
          },
        );
      }

      // =================================================
      // CREATE
      // =================================================

      else {
        console.log('POST /api/product');

        response = await api.post(
          '/product',
          data,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            transformRequest: value => value,
          },
        );
      }

      console.log(
        'PRODUCT RESPONSE:',
        response.data,
      );

      Alert.alert(
        'Success',
        response.data?.message ||
          (editingId
            ? 'Product updated successfully.'
            : 'Product created successfully.'),
      );

      resetForm();

      await fetchProducts();
    } catch (error) {
      console.log('================================');
      console.log('PRODUCT API ERROR');
      console.log('================================');
      console.log('MESSAGE:', error.message);
      console.log('STATUS:', error.response?.status);
      console.log('DATA:', error.response?.data);
      console.log('HEADERS:', error.response?.headers);
      console.log('================================');

      if (error.response) {
        const message = getErrorMessage(
          error,
          'Product operation failed.',
        );

        Alert.alert(
          `HTTP ${error.response.status}`,
          message,
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

  // =====================================================
  // EDIT
  // =====================================================

  const handleEdit = item => {
    const productId =
      item._id || item.id;

    setEditingId(productId);

    // -----------------------------
    // CATEGORY
    // -----------------------------

    let categoryId = '';

    if (
      item.category &&
      typeof item.category === 'object'
    ) {
      categoryId =
        item.category._id ||
        item.category.id ||
        '';
    } else {
      categoryId =
        item.category || '';
    }

    // -----------------------------
    // SUPPLIER
    // -----------------------------

    let supplierId = '';

    if (
      item.supplier &&
      typeof item.supplier === 'object'
    ) {
      supplierId =
        item.supplier._id ||
        item.supplier.id ||
        '';
    } else {
      supplierId =
        item.supplier || '';
    }

    setFormData({
      productName:
        item.productName || '',

      sku:
        item.sku || '',

      barcode:
        item.barcode || '',

      category:
        categoryId,

      supplier:
        supplierId,

      purchasePrice:
        item.purchasePrice !== undefined
          ? String(item.purchasePrice)
          : '',

      sellingPrice:
        item.sellingPrice !== undefined
          ? String(item.sellingPrice)
          : '',

      quantity:
        item.quantity !== undefined
          ? String(item.quantity)
          : '0',

      description:
        item.description || '',

      status:
        item.status || 'Active',

      image:
        item.image
          ? {
              uri: item.image,
            }
          : null,
    });

    console.log(
      'EDIT CATEGORY ID:',
      categoryId,
    );

    console.log(
      'EDIT SUPPLIER ID:',
      supplierId,
    );
  };

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = id => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
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
                `DELETE /api/product/${id}`,
              );

              const response =
                await api.delete(
                  `/product/${id}`,
                );

              Alert.alert(
                'Success',
                response.data?.message ||
                  'Product deleted successfully.',
              );

              await fetchProducts();
            } catch (error) {
              console.log(
                'DELETE ERROR:',
                error.response?.data ||
                  error.message,
              );

              Alert.alert(
                'Error',
                getErrorMessage(
                  error,
                  'Failed to delete product.',
                ),
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      productName: '',
      sku: '',
      barcode: '',
      category: '',
      supplier: '',
      purchasePrice: '',
      sellingPrice: '',
      quantity: '0',
      description: '',
      status: 'Active',
      image: null,
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#007AFF"
        />

        <Text style={styles.loadingText}>
          Loading products...
        </Text>
      </View>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">

      <Text style={styles.heading}>
        {editingId
          ? 'Edit Product Record'
          : 'Add Product Details'}
      </Text>

      {/* IMAGE */}

      <Text style={styles.label}>
        Product Image
      </Text>

      <TouchableOpacity
        style={styles.imagePickerContainer}
        onPress={handlePickImage}
        disabled={loading}>

        {formData.image?.uri ? (
          <Image
            source={{
              uri: formData.image.uri,
            }}
            style={styles.previewImage}
          />
        ) : (
          <Text style={styles.imagePlaceholderText}>
            + Tap to select product image
          </Text>
        )}
      </TouchableOpacity>

      {/* PRODUCT NAME */}

      <Text style={styles.label}>
        Product Name *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={formData.productName}
        onChangeText={text =>
          handleChange(
            'productName',
            text,
          )
        }
        editable={!loading}
      />

      {/* SKU */}

      <Text style={styles.label}>
        SKU *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter unique SKU"
        value={formData.sku}
        onChangeText={text =>
          handleChange('sku', text)
        }
        editable={!loading}
      />

      {/* BARCODE */}

      <Text style={styles.label}>
        Barcode *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter barcode"
        value={formData.barcode}
        onChangeText={text =>
          handleChange(
            'barcode',
            text,
          )
        }
        editable={!loading}
      />

      {/* CATEGORY */}

      <Text style={styles.label}>
        Category *
      </Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={
            formData.category
          }
          onValueChange={value =>
            handleChange(
              'category',
              value,
            )
          }
          enabled={!loading}>

          <Picker.Item
            label={
              categories.length === 0
                ? 'No categories found'
                : 'Select Category'
            }
            value=""
          />

          {categories.map(
            category => (
              <Picker.Item
                key={category._id}
                label={
                  category.name ||
                  category.categoryName ||
                  category.title ||
                  'Unnamed Category'
                }
                value={category._id}
              />
            ),
          )}
        </Picker>
      </View>

      {/* SUPPLIER */}

      <Text style={styles.label}>
        Supplier *
      </Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={
            formData.supplier
          }
          onValueChange={value =>
            handleChange(
              'supplier',
              value,
            )
          }
          enabled={!loading}>

          <Picker.Item
            label={
              suppliers.length === 0
                ? 'No suppliers found'
                : 'Select Supplier'
            }
            value=""
          />

          {suppliers.map(
            supplier => (
              <Picker.Item
                key={supplier._id}
                label={
                  supplier.name ||
                  supplier.supplierName ||
                  supplier.companyName ||
                  supplier.businessName ||
                  'Unnamed Supplier'
                }
                value={supplier._id}
              />
            ),
          )}
        </Picker>
      </View>

      {/* PRICE */}

      <View style={styles.row}>

        <View style={styles.halfInputContainer}>

          <Text style={styles.label}>
            Purchase Price *
          </Text>

          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={
              formData.purchasePrice
            }
            onChangeText={text =>
              handleChange(
                'purchasePrice',
                text,
              )
            }
            editable={!loading}
          />

        </View>

        <View style={styles.halfInputContainer}>

          <Text style={styles.label}>
            Selling Price *
          </Text>

          <TextInput
            style={styles.input}
            placeholder="0.00"
            keyboardType="numeric"
            value={
              formData.sellingPrice
            }
            onChangeText={text =>
              handleChange(
                'sellingPrice',
                text,
              )
            }
            editable={!loading}
          />

        </View>

      </View>

      {/* QUANTITY */}

      <Text style={styles.label}>
        Quantity *
      </Text>

      <TextInput
        style={styles.input}
        placeholder="0"
        keyboardType="numeric"
        value={
          formData.quantity
        }
        onChangeText={text =>
          handleChange(
            'quantity',
            text,
          )
        }
        editable={!loading}
      />

      {/* DESCRIPTION */}

      <Text style={styles.label}>
        Description
      </Text>

      <TextInput
        style={[
          styles.input,
          styles.textArea,
        ]}
        placeholder="Product description..."
        multiline
        numberOfLines={4}
        value={
          formData.description
        }
        onChangeText={text =>
          handleChange(
            'description',
            text,
          )
        }
        editable={!loading}
      />

      {/* STATUS */}

      <View style={styles.switchContainer}>

        <Text style={styles.label}>
          Active Status
        </Text>

        <Switch
          value={
            formData.status ===
            'Active'
          }
          onValueChange={value =>
            handleChange(
              'status',
              value
                ? 'Active'
                : 'Inactive',
            )
          }
          disabled={loading}
        />

      </View>

      {/* SAVE */}

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
              ? 'Update Product'
              : 'Save Product'}
          </Text>
        )}

      </TouchableOpacity>

      {/* CANCEL */}

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

      {/* PRODUCTS */}

      <View style={styles.recordsSection}>

        <Text style={styles.subHeading}>
          Product Records from Database
        </Text>

        {products.length === 0 ? (

          <Text
            style={
              styles.noRecordsText
            }>
            No records found.
          </Text>

        ) : (

          products.map(
            (item, index) => {

              const productId =
                item._id || item.id;

              return (
                <View
                  key={
                    productId || index
                  }
                  style={
                    styles.recordCard
                  }>

                  {item.image ? (
                    <Image
                      source={{
                        uri: item.image,
                      }}
                      style={
                        styles.recordThumbnail
                      }
                    />
                  ) : null}

                  <View
                    style={
                      styles.recordInfo
                    }>

                    <Text
                      style={
                        styles.recordTitle
                      }>
                      {
                        item.productName
                      }
                    </Text>

                    <Text
                      style={
                        styles.recordDetail
                      }>
                      SKU: {item.sku}
                    </Text>

                    <Text
                      style={
                        styles.recordDetail
                      }>
                      Qty: {item.quantity}
                    </Text>

                    <Text
                      style={
                        styles.recordDetail
                      }>
                      Price: ₹
                      {
                        item.sellingPrice
                      }
                    </Text>

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
                          productId,
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

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 15,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 22,
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

  imagePickerContainer: {
    height: 140,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  imagePlaceholderText: {
    color: '#888',
    fontSize: 14,
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
    color: '#222',
  },

  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fafafa',
    marginBottom: 14,
    overflow: 'hidden',
  },

  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  halfInputContainer: {
    width: '48%',
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },

  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    minHeight: 50,
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

  recordThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 10,
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
    marginTop: 2,
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

export default ProductScreen;