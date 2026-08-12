import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { getSuppliers } from '../services/supplierService';
import { getPurchaseOrders, createPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder } from '../services/purchaseOrderService';

const API_URL = 'http://10.0.2.2:6000/api';

const PurchaseOrderScreen = () => {
  const [formData, setFormData] = useState({
    supplier: '',
    productId: '', 
    productQuantity: '',
    totalAmount: '',
    status: 'Pending',
  });

  const [productsList, setProductsList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(false);
  
  useEffect(() => {
    fetchSuppliers();
    fetchAvailableProducts();
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await getPurchaseOrders();
      setPurchaseOrders(Array.isArray(data) ? data : (data.purchaseOrders || []));
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddProduct = () => {
    if (!formData.productId || !formData.productQuantity) {
      Alert.alert('Error', 'Please select a product and provide quantity.');
      return;
    }
    setProductsList([
      ...productsList,
      { product: formData.productId, quantity: parseInt(formData.productQuantity, 10) || 0 }
    ]);
    setFormData({ ...formData, productId: '', productQuantity: '' });
  };

  const handleRemoveProduct = (index) => {
    const updated = productsList.filter((_, i) => i !== index);
    setProductsList(updated);
  };

  const handleSubmit = async () => {
    if (!formData.supplier || productsList.length === 0 || !formData.totalAmount) {
      Alert.alert('Error', 'Please fill out supplier, total amount, and add at least one product.');
      return;
    }

    const payload = {
      supplier: formData.supplier,
      products: productsList,
      totalAmount: parseFloat(formData.totalAmount),
      status: formData.status,
    };

    try {
      if (editingId) {
        await updatePurchaseOrder(editingId, payload);
        Alert.alert('Success', 'Purchase Order updated successfully');
      } else {
        await createPurchaseOrder(payload);
        Alert.alert('Success', 'Purchase Order created successfully');
      }
      resetForm();
      fetchOrders();
    } catch (error) {
      console.error('Submission error:', error);
      Alert.alert('Error', 'Operation failed');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id || item.id);
    setFormData({
      supplier: item.supplier?._id || item.supplier || '',
      productId: '',
      productQuantity: '',
      totalAmount: item.totalAmount?.toString() || '',
      status: item.status || 'Pending',
    });
    // Map existing products back into productsList safely for editing
    const formattedProducts = (item.products || []).map(p => ({
      product: p.product?._id || p.product,
      quantity: p.quantity
    }));
    setProductsList(formattedProducts);
  };

  const handleDelete = async (id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this purchase order?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePurchaseOrder(id);
            Alert.alert('Success', 'Purchase Order deleted');
            fetchOrders();
          } catch (error) {
            console.error('Delete error:', error);
            Alert.alert('Error', 'Failed to delete record');
          }
        },
      },
    ]);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
      supplier: '',
      productId: '',
      productQuantity: '',
      totalAmount: '',
      status: 'Pending',
    });
    setProductsList([]);
  };

  const fetchSuppliers = async () => {
    try {
      setLoadingSuppliers(true);
      const data = await getSuppliers();

      if (Array.isArray(data)) {
        setSuppliers(data);
      } else if (Array.isArray(data?.suppliers)) {
        setSuppliers(data.suppliers);
      } else {
        setSuppliers([]);
      }
    } catch (error) {
      console.error('FETCH SUPPLIERS ERROR:', error.message);
      Alert.alert('Supplier Error', 'Unable to load suppliers.');
    } finally {
      setLoadingSuppliers(false);
    }
  };

    const fetchAvailableProducts = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      console.log('RAW PRODUCTS RESPONSE:', data); // Check your terminal to see this log

      if (Array.isArray(data)) {
        setProducts(data);
      } else if (Array.isArray(data?.products)) {
        setProducts(data.products);
      } else if (Array.isArray(data?.data)) {
        setProducts(data.data);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('FETCH PRODUCTS ERROR:', error.message);
      Alert.alert('Product Error', 'Unable to load products.');
    } finally {
      setLoadingProducts(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        {editingId ? 'Edit Purchase Order' : 'Add Purchase Order'}
      </Text>

      {/* Supplier Dropdown Menu */}
      <Text style={styles.label}>Supplier *</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={formData.supplier}
          onValueChange={(itemValue) => handleChange('supplier', itemValue)}
        >
          <Picker.Item label={loadingSuppliers ? "Loading suppliers..." : "Select Supplier"} value="" />
          {suppliers.map((sup, idx) => (
            <Picker.Item 
              key={sup._id || sup.id || idx} 
              label={sup.supplierName || sup.name || 'Unnamed Supplier'} 
              value={sup._id || sup.id} 
            />
          ))}
        </Picker>
      </View>

      {/* Product Sub-form with Dropdown */}
      <View style={styles.subFormContainer}>
        <Text style={styles.subFormTitle}>Add Products to Order</Text>
        
        <Text style={styles.subLabel}>Select Product *</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={formData.productId}
            onValueChange={(itemValue) => handleChange('productId', itemValue)}
          >
            <Picker.Item label={loadingProducts ? "Loading products..." : "Select Product"} value="" />
            {products.map((prod, idx) => (
              <Picker.Item 
                key={prod._id || prod.id || idx} 
                label={prod.productName || prod.name || prod.title || 'Unnamed Product'} 
                value={prod._id || prod.id} 
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.subLabel}>Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="Qty"
          keyboardType="numeric"
          value={formData.productQuantity}
          onChangeText={(text) => handleChange('productQuantity', text)}
        />

        <TouchableOpacity style={styles.addProductBtn} onPress={handleAddProduct}>
          <Text style={styles.addProductText}>+ Add Product Item</Text>
        </TouchableOpacity>

        {productsList.map((p, index) => {
          // Find matching product name for UI visualization purposes
          const matchedProd = products.find(prod => (prod._id || prod.id) === p.product);
          const displayName = matchedProd?.productName || matchedProd?.name || matchedProd?.title || 'Product ID: ' + p.product;
          return (
            <View key={index} style={styles.addedProductRow}>
              <Text style={styles.addedProductText}>Product: {displayName} | Qty: {p.quantity}</Text>
              <TouchableOpacity onPress={() => handleRemoveProduct(index)}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>

      {/* Total Amount */}
      <Text style={styles.label}>Total Amount *</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="numeric"
        value={formData.totalAmount}
        onChangeText={(text) => handleChange('totalAmount', text)}
      />

      {/* Status Selection */}
      <Text style={styles.label}>Status *</Text>
      <View style={styles.statusContainer}>
        {['Pending', 'Completed', 'Cancelled'].map((st) => (
          <TouchableOpacity
            key={st}
            style={[
              styles.statusButton,
              formData.status === st && styles.statusButtonActive,
            ]}
            onPress={() => handleChange('status', st)}
          >
            <Text
              style={[
                styles.statusButtonText,
                formData.status === st && styles.statusButtonTextActive,
              ]}
            >
              {st}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Submit / Update Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {editingId ? 'Update Purchase Order' : 'Save Purchase Order'}
        </Text>
      </TouchableOpacity>

      {editingId && (
        <TouchableOpacity style={styles.cancelButton} onPress={resetForm}>
          <Text style={styles.cancelButtonText}>Cancel Edit</Text>
        </TouchableOpacity>
      )}

      {/* Database Records List Section */}
      <View style={styles.recordsSection}>
        <Text style={styles.subHeading}>Purchase Order Records</Text>
        
        {purchaseOrders.length === 0 ? (
          <Text style={styles.noRecordsText}>No records found.</Text>
        ) : (
          purchaseOrders.map((item, index) => (
            <View key={item._id || index} style={styles.recordCard}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordTitle}>
                  Supplier: {item.supplier?.supplierName || item.supplier?.name || 'Unknown Supplier'}
                </Text>
                <Text style={styles.recordDetail}>Total: ${item.totalAmount} | Status: {item.status}</Text>
                
                <Text style={styles.recordDetail}>Products:</Text>
                {item.products?.map((p, pIdx) => {
                  const prodName = p.product?.productName || p.product?.name || p.product?.title || 'Product ID: ' + (p.product?._id || p.product);
                  return (
                    <Text key={pIdx} style={styles.subProductDetail}>
                      • {prodName} (Qty: {p.quantity})
                    </Text>
                  );
                })}
              </View>

              <View style={styles.recordActions}>
                <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item._id || item.id)}>
                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
};

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
  subLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
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
    justifyContent: 'center',
  },
  subFormContainer: {
    backgroundColor: '#f1f3f5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
  },
  subFormTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#495057',
  },
  addProductBtn: {
    backgroundColor: '#6c757d',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  addProductText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  addedProductRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 4,
    marginBottom: 4,
    alignItems: 'center',
  },
  addedProductText: {
    fontSize: 12,
    color: '#333',
  },
  subProductDetail: {
    fontSize: 12,
    color: '#555',
    marginLeft: 6,
  },
  removeText: {
    color: '#dc3545',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statusButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fafafa',
    marginHorizontal: 3,
  },
  statusButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
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

export default PurchaseOrderScreen;