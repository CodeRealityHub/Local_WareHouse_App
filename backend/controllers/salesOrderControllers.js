import SalesOrder from "../models/SalesOrder.js";
import Product from "../models/Product.js"; // Added Product model import

export const createSalesOrder = async (req, res) => {
  try {
    const so = await SalesOrder.create(req.body);
    // Deduct stock for items ordered
    for (let item of req.body.products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { quantity: -item.quantity } });
    }
    res.status(201).json(so);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getSalesOrders = async (req, res) => {
  try {
    const sos = await SalesOrder.find().populate('customer products.product');
    res.status(200).json(sos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Added full update controller matching your salesOrderRoutes.js
export const updateSalesOrder = async (req, res) => {
  try {
    const so = await SalesOrder.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('customer products.product');
    if (!so) {
      return res.status(404).json({ message: 'Sales Order not found' });
    }
    res.status(200).json(so);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateSalesOrderStatus = async (req, res) => {
  try {
    const so = await SalesOrder.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
      .populate('customer products.product');
    if (!so) {
      return res.status(404).json({ message: 'Sales Order not found' });
    }
    res.status(200).json(so);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteSalesOrder = async (req, res) => {
  try {
    const so = await SalesOrder.findByIdAndDelete(req.params.id);
    if (!so) {
      return res.status(404).json({ message: 'Sales Order not found' });
    }
    res.status(200).json({ message: 'Sales Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};