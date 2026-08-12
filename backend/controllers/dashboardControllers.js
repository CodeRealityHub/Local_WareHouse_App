import Product from "../models/Product.js";
import Category from "../models/Category.js";
import Supplier from "../models/Supplier.js";
import Customer from "../models/Customer.js";
import SalesOrder from "../models/SalesOrder.js";
import Inventory from "../models/Inventory.js";
import PurchaseOrder from "../models/PurchaseOrder.js";

export const getDashboardData = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalOrders = await SalesOrder.countDocuments();
    const lowStockProducts = await Product.find({ quantity: { $lte: 5 } }); // Threshold = 5
    const recentActivities = await Inventory.find().sort({ date: -1 }).limit(10).populate('product');

    res.status(200).json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalCustomers,
      totalOrders,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentActivities
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReports = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await Customer.countDocuments();
    const totalSuppliers = await Supplier.countDocuments();
    
    const salesAgg = await SalesOrder.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]);
    const purchaseAgg = await PurchaseOrder.aggregate([{ $group: { _id: null, totalPurchases: { $sum: '$totalAmount' } } }]);
    
    const lowStockReport = await Product.find({ quantity: { $lte: 5 } });
    const inventoryReport = await Inventory.find().populate('product');

    res.status(200).json({
      totalProducts,
      totalCustomers,
      totalSuppliers,
      totalSales: salesAgg[0]?.totalSales || 0,
      totalPurchases: purchaseAgg[0]?.totalPurchases || 0,
      lowStockReport,
      inventoryReport
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};