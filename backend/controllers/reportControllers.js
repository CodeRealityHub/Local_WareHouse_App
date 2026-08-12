import Product from '../models/Product.js';
import Customer from '../models/Customer.js';
import Supplier from '../models/Supplier.js';
import SalesOrder from '../models/SalesOrder.js';
import PurchaseOrder from '../models/PurchaseOrder.js';

export const getReportMetrics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();

    // Calculate total sales amount from SalesOrders
    const salesOrders = await SalesOrder.find();
    const totalSales = salesOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // Calculate total purchases amount from PurchaseOrders
    const purchaseOrders = await PurchaseOrder.find();
    const totalPurchases = purchaseOrders.reduce((acc, order) => acc + (order.totalAmount || 0), 0);

    // Fetch low stock items (e.g., quantity <= 5)
    const lowStockItems = await Product.find({ quantity: { $lte: 5 } });
    const lowStockReport = lowStockItems.map(p => ({
      name: p.productName || p.name,
      quantity: p.quantity
    }));

    // Generate inventory category breakdown dynamically
    const products = await Product.find();
    const categoryMap = {};
    products.forEach(p => {
      const cat = p.category || 'Uncategorized';
      categoryMap[cat] = (categoryMap[cat] || 0) + (p.quantity || 0);
    });

    const inventoryReport = Object.keys(categoryMap).map(category => ({
      category,
      totalItems: categoryMap[category]
    }));

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalSuppliers,
      totalSales,
      totalPurchases,
      lowStockReport,
      inventoryReport,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getDashboardMetrics = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const lowStockItems = await Product.countDocuments({ quantity: { $lte: 5 } });
    
    const purchaseOrders = await PurchaseOrder.find({ status: 'Pending' });
    const pendingPurchaseOrders = purchaseOrders.length;

    const salesOrders = await SalesOrder.find();
    
    const totalRevenue = salesOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const monthlySales = salesOrders.reduce((acc, order) => {
      const orderDate = new Date(order.createdAt || Date.now());
      if (orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear) {
        return acc + (order.totalPrice || 0);
      }
      return acc;
    }, 0);

    const pendingDeliveries = salesOrders.filter(order => order.status === 'Pending' || order.status === 'Shipped').length;

    res.status(200).json({
      dashboardData: {
        totalProducts,
        totalCustomers,
        lowStockItems,
        pendingPurchaseOrders,
      },
      reportsData: {
        totalRevenue,
        monthlySales,
        pendingDeliveries,
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ error: error.message });
  }
};