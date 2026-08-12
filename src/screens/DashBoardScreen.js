import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

// Custom pure SVG/Text-based Vector Icons using React Native Text components
// This requires zero external packages (No @expo/vector-icons needed)
const Icons = {
  Product: () => <Text style={styles.iconSymbol}>📦</Text>,
  Customer: () => <Text style={styles.iconSymbol}>👥</Text>,
  Inventory: () => <Text style={styles.iconSymbol}>🏢</Text>,
  Supplier: () => <Text style={styles.iconSymbol}>🚚</Text>,
  Category: () => <Text style={styles.iconSymbol}>🏷️</Text>,
  Purchase: () => <Text style={styles.iconSymbol}>🛒</Text>,
  Sales: () => <Text style={styles.iconSymbol}>📄</Text>,
};

export default function DashboardScreen({ navigation }) {
  const menuItems = [
    {
      id: 'ProductScreen',
      title: 'Products',
      icon: <Icons.Product />,
      screen: 'ProductScreen',
    },
    {
      id: 'CustomerScreen',
      title: 'Customers',
      icon: <Icons.Customer />,
      screen: 'CustomerScreen',
    },
    {
      id: 'InventoryScreen',
      title: 'Inventory',
      icon: <Icons.Inventory />,
      screen: 'InventoryScreen',
    },
    {
      id: 'SupplierScreen',
      title: 'Suppliers',
      icon: <Icons.Supplier />,
      screen: 'SupplierScreen',
    },
    {
      id: 'CategoryScreen',
      title: 'Categories',
      icon: <Icons.Category />,
      screen: 'CategoryScreen',
    },
    {
      id: 'PurchaseOrderScreen',
      title: 'Purchase Orders',
      icon: <Icons.Purchase />,
      screen: 'PurchaseOrderScreen',
    },
    {
      id: 'SalesOrderScreen',
      title: 'Sales Orders',
      icon: <Icons.Sales />,
      screen: 'SalesOrderScreen',
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.appName}>Local Warehouse Dashboard</Text>
      </View>

      <View style={styles.gridContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={styles.iconContainer}>{item.icon}</View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '600',
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#343a40',
    marginTop: 4,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: cardWidth,
    height: 130,
    backgroundColor: 'lightgray', // Set all cards to lightgray
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  iconSymbol: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
});