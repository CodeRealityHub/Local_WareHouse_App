import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');
const API_URL = 'http://10.0.2.2:6000/api';

const ReportScreen = () => {
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState({
    totalProducts: 0,
    totalCustomers: 0,
    totalSuppliers: 0,
    totalSales: 0,
    totalPurchases: 0,
    lowStockReport: [],
    inventoryReport: [],
  });

  const [inputTitle, setInputTitle] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [inputType, setInputType] = useState('inventoryReport');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/reports/metrics`);
      const data = await response.json();

      if (response.ok) {
        setReportData(data);
      } else {
        Alert.alert('Error', data.error || 'Failed to load report data');
      }
    } catch (error) {
      console.error('Error fetching report data:', error);
      Alert.alert('Network Error', 'Could not connect to the database server.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = () => {
    if (!inputTitle || !inputValue) {
      Alert.alert('Error', 'Please fill out both entry title and value/quantity.');
      return;
    }

    // Local simulation update (or send to a custom database endpoint if required)
    if (inputType === 'inventoryReport') {
      setReportData((prev) => ({
        ...prev,
        inventoryReport: [
          ...prev.inventoryReport,
          { category: inputTitle, totalItems: parseInt(inputValue, 10) || 0 },
        ],
      }));
    } else {
      setReportData((prev) => ({
        ...prev,
        lowStockReport: [
          ...prev.lowStockReport,
          { name: inputTitle, quantity: parseInt(inputValue, 10) || 0 },
        ],
      }));
    }

    Alert.alert('Success', 'Record added to view!');
    setInputTitle('');
    setInputValue('');
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
      <Text style={styles.heading}>System Performance & Analytics</Text>

      {/* Metric Cards Grid */}
      <View style={styles.gridContainer}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Products</Text>
          <Text style={styles.cardValue}>{reportData.totalProducts}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Customers</Text>
          <Text style={styles.cardValue}>{reportData.totalCustomers}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Suppliers</Text>
          <Text style={styles.cardValue}>{reportData.totalSuppliers}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Sales</Text>
          <Text style={styles.cardValue}>${reportData.totalSales}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Purchases</Text>
          <Text style={styles.cardValue}>${reportData.totalPurchases}</Text>
        </View>
      </View>

      {/* Custom Entry Form Section */}
      <View style={styles.inputSectionContainer}>
        <Text style={styles.subHeading}>Add Custom UI Entry</Text>
        
        <View style={styles.typeSelectorRow}>
          <TouchableOpacity
            style={[styles.typeBtn, inputType === 'inventoryReport' && styles.typeBtnActive]}
            onPress={() => setInputType('inventoryReport')}
          >
            <Text style={[styles.typeBtnText, inputType === 'inventoryReport' && styles.typeBtnTextActive]}>Inventory Report</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeBtn, inputType === 'lowStockReport' && styles.typeBtnActive]}
            onPress={() => setInputType('lowStockReport')}
          >
            <Text style={[styles.typeBtnText, inputType === 'lowStockReport' && styles.typeBtnTextActive]}>Low Stock Report</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.inputField}
          placeholder={inputType === 'inventoryReport' ? 'Category Name' : 'Item Name'}
          placeholderTextColor="#888"
          value={inputTitle}
          onChangeText={setInputTitle}
        />
        <TextInput
          style={styles.inputField}
          placeholder={inputType === 'inventoryReport' ? 'Total Items Count' : 'Quantity Left'}
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={inputValue}
          onChangeText={setInputValue}
        />

        <TouchableOpacity style={styles.saveButton} onPress={handleAddRecord}>
          <Text style={styles.saveButtonText}>Add to List</Text>
        </TouchableOpacity>
      </View>

      {/* Low Stock Report Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.subHeading}>Low Stock Report</Text>
        {reportData.lowStockReport.length === 0 ? (
          <Text style={styles.noDataText}>All items are sufficiently stocked.</Text>
        ) : (
          reportData.lowStockReport.map((item, index) => (
            <View key={index} style={styles.reportRow}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowValueAlert}>Qty: {item.quantity}</Text>
            </View>
          ))
        )}
      </View>

      {/* Inventory Report Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.subHeading}>Inventory Report</Text>
        {reportData.inventoryReport.length === 0 ? (
          <Text style={styles.noDataText}>No inventory breakdown available.</Text>
        ) : (
          reportData.inventoryReport.map((item, index) => (
            <View key={index} style={styles.reportRow}>
              <Text style={styles.rowTitle}>{item.category}</Text>
              <Text style={styles.rowValue}>Total Items: {item.totalItems}</Text>
            </View>
          ))
        )}
      </View>

      {/* Refresh Button */}
      <TouchableOpacity style={styles.refreshButton} onPress={fetchReportData}>
        <Text style={styles.refreshButtonText}>Refresh Reports</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 16,
    color: '#333',
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#495057',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    width: '48%',
    backgroundColor: 'lightgray',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 13,
    color: '#555',
    fontWeight: '600',
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  inputSectionContainer: {
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  typeSelectorRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  typeBtnActive: {
    backgroundColor: '#343a40',
    borderColor: '#343a40',
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#495057',
  },
  typeBtnTextActive: {
    color: '#fff',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    color: '#000',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  sectionContainer: {
    backgroundColor: 'lightgray',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  noDataText: {
    color: '#666',
    fontStyle: 'italic',
    fontSize: 13,
  },
  reportRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  rowValue: {
    fontSize: 13,
    color: '#555',
  },
  rowValueAlert: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  refreshButton: {
    backgroundColor: '#6c757d',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportScreen;