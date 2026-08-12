import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';


const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;
const API_URL = 'http://10.0.2.2:6000/api';

export default function HomeScreen({ navigation }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [reportsData, setReportsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    fetchDashboardMetrics();
    updateGreetingTime();
  }, []);

  const updateGreetingTime = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning ☀️');
    } else if (currentHour < 17) {
      setGreeting('Good Afternoon 🌤️');
    } else {
      setGreeting('Good Evening 🌙');
    }
  };

  const fetchDashboardMetrics = async () => {
    try {
      const response = await fetch(`${API_URL}/reports/dashboard`);
      const data = await response.json();

      if (response.ok) {
        setDashboardData(data.dashboardData);
        setReportsData(data.reportsData);
      } else {
        console.error("Failed to load metrics from server");
      }
    } catch (error) {
      console.error("Error fetching dashboard/report metrics:", error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'ProductScreen', title: 'Products', icon: '📦', screen: 'ProductScreen', metric: dashboardData ? `${dashboardData.totalProducts} Items` : '...' },
    { id: 'CustomerScreen', title: 'Customers', icon: '👥', screen: 'CustomerScreen', metric: dashboardData ? `${dashboardData.totalCustomers} Active` : '...' },
    { id: 'InventoryScreen', title: 'Inventory', icon: '🏢', screen: 'InventoryScreen', metric: dashboardData ? `${dashboardData.lowStockItems} Low Stock` : '...' },
    { id: 'SupplierScreen', title: 'Suppliers', icon: '🚚', screen: 'SupplierScreen', metric: 'Manage' },
    { id: 'CategoryScreen', title: 'Categories', icon: '🏷️', screen: 'CategoryScreen', metric: 'Organize' },
    { id: 'PurchaseOrderScreen', title: 'Purchase Orders', icon: '🛒', screen: 'PurchaseOrderScreen', metric: dashboardData ? `${dashboardData.pendingPurchaseOrders} Pending` : '...' },
    { id: 'SalesOrderScreen', title: 'Sales Orders', icon: '📄', screen: 'SalesOrderScreen', metric: reportsData ? `${reportsData.pendingDeliveries} Deliveries` : '...' },
    { id: 'ReportScreen', title: 'Reports', icon: '📊', screen: 'ReportScreen', metric: 'Analytics' },
  ];

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.header}>
          <Text style={styles.appName}>Local Warehouse Dashboard</Text>
          <Text style={styles.welcomeText}>Welcome Back, {greeting}</Text>
        </View>

        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('ProfileScreen')}
        >
          <Text style={styles.profileIconSymbol}>👤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportBanner}>
        <View style={styles.reportItem}>
          <Text style={styles.reportLabel}>Total Revenue</Text>
          <Text style={styles.reportValue}>${reportsData?.totalRevenue ?? 0}</Text>
        </View>
        <View style={styles.reportDivider} />
        <View style={styles.reportItem}>
          <Text style={styles.reportLabel}>Monthly Sales</Text>
          <Text style={styles.reportValue}>${reportsData?.monthlySales ?? 0}</Text>
        </View>
      </View>

      <View style={styles.gridContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Text style={styles.iconSymbol}>{item.icon}</Text>
              </View>
              <Text style={styles.cardMetric}>{item.metric}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f8f9fa', flexGrow: 1 },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, marginTop: 10 },
  header: { flex: 1, alignItems: 'center' },
  appName: { marginTop: 20, fontSize: 22, fontWeight: 'bold', color: '#343a40', textAlign: 'center' },
  welcomeText: { fontSize: 14, color: '#6c757d', fontWeight: '600', marginTop: 4, textAlign: 'center' },
  profileButton: { width: 42, height: 42, backgroundColor: 'lightgray', borderRadius: 8, justifyContent: 'center', alignItems: 'center', position: 'absolute', right: 0, top: 25, marginLeft: 30, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.05)' },
  profileIconSymbol: { fontSize: 20 },
  reportBanner: { flexDirection: 'row', backgroundColor: '#e9ecef', borderRadius: 12, padding: 16, marginBottom: 20, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: '#dee2e6' },
  reportItem: { flex: 1, alignItems: 'center' },
  reportDivider: { width: 1, height: '80%', backgroundColor: '#ced4da' },
  reportLabel: { color: '#495057', fontSize: 12, fontWeight: '600', marginBottom: 4 },
  reportValue: { color: '#212529', fontSize: 18, fontWeight: 'bold' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { width: cardWidth, height: 130, backgroundColor: 'lightgray', borderRadius: 16, padding: 16, justifyContent: 'space-between', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, borderWidth: 1, borderColor: 'rgba(0,0,0,0.04)' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  iconContainer: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 1 },
  iconSymbol: { fontSize: 18 },
  cardMetric: { fontSize: 11, fontWeight: 'bold', color: '#333', backgroundColor: 'rgba(255,255,255,0.7)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, overflow: 'hidden' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  databaseButtonContainer: { width: '100%', alignItems: 'center', marginTop: 8, marginBottom: 20 },
  databaseButton: { backgroundColor: '#343a40', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12, width: '100%', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  databaseButtonText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});