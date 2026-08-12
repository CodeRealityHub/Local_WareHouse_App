import PurchaseOrder from '../models/PurchaseOrder.js';

// ==========================================
// CREATE PURCHASE ORDER
// POST /api/purchase-order
// ==========================================

export const createPurchaseOrder = async (req, res) => {
  try {
    const {
      supplier,
      products,
      totalAmount,
      status,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!supplier) {
      return res.status(400).json({
        message: 'Supplier is required',
      });
    }

    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: 'At least one product is required',
      });
    }

    if (
      totalAmount === undefined ||
      Number(totalAmount) < 0
    ) {
      return res.status(400).json({
        message: 'Valid total amount is required',
      });
    }

    if (
      status &&
      !['Pending', 'Completed', 'Cancelled'].includes(
        status,
      )
    ) {
      return res.status(400).json({
        message:
          'Status must be Pending, Completed, or Cancelled',
      });
    }

    // -----------------------------
    // CREATE
    // -----------------------------

    const po = await PurchaseOrder.create({
      supplier,
      products,
      totalAmount: Number(totalAmount),
      status: status || 'Pending',
    });

    // Populate supplier + products
    const populatedPO =
      await PurchaseOrder.findById(po._id)
        .populate('supplier')
        .populate('products.product');

    res.status(201).json({
      message: 'Purchase Order created successfully',
      purchaseOrder: populatedPO,
    });
  } catch (err) {
    console.error(
      'CREATE PURCHASE ORDER ERROR:',
      err,
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// GET PURCHASE ORDERS
// GET /api/purchase-order
// ==========================================

export const getPurchaseOrders = async (req, res) => {
  try {
    const pos =
      await PurchaseOrder.find()
        .populate('supplier')
        .populate('products.product')
        .sort({
          createdAt: -1,
        });

    res.status(200).json(pos);
  } catch (err) {
    console.error(
      'GET PURCHASE ORDERS ERROR:',
      err,
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// UPDATE PURCHASE ORDER
// PUT /api/purchase-order/:id
// ==========================================

export const updatePurchaseOrder = async (
  req,
  res,
) => {
  try {
    const {id} = req.params;

    const {
      supplier,
      products,
      totalAmount,
      status,
    } = req.body;

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (!supplier) {
      return res.status(400).json({
        message: 'Supplier is required',
      });
    }

    if (
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({
        message: 'At least one product is required',
      });
    }

    if (
      totalAmount === undefined ||
      Number(totalAmount) < 0
    ) {
      return res.status(400).json({
        message: 'Valid total amount is required',
      });
    }

    if (
      !['Pending', 'Completed', 'Cancelled'].includes(
        status,
      )
    ) {
      return res.status(400).json({
        message:
          'Status must be Pending, Completed, or Cancelled',
      });
    }

    // -----------------------------
    // FIND ORDER
    // -----------------------------

    const existingPO =
      await PurchaseOrder.findById(id);

    if (!existingPO) {
      return res.status(404).json({
        message: 'Purchase Order not found',
      });
    }

    // -----------------------------
    // UPDATE
    // -----------------------------

    existingPO.supplier = supplier;
    existingPO.products = products;
    existingPO.totalAmount =
      Number(totalAmount);
    existingPO.status = status;

    await existingPO.save();

    // -----------------------------
    // POPULATE
    // -----------------------------

    const updatedPO =
      await PurchaseOrder.findById(id)
        .populate('supplier')
        .populate('products.product');

    res.status(200).json({
      message:
        'Purchase Order updated successfully',
      purchaseOrder: updatedPO,
    });
  } catch (err) {
    console.error(
      'UPDATE PURCHASE ORDER ERROR:',
      err,
    );

    res.status(500).json({
      message: err.message,
    });
  }
};

// ==========================================
// DELETE PURCHASE ORDER
// DELETE /api/purchase-order/:id
// ==========================================

export const deletePurchaseOrder = async (
  req,
  res,
) => {
  try {
    const {id} = req.params;

    const po =
      await PurchaseOrder.findById(id);

    if (!po) {
      return res.status(404).json({
        message: 'Purchase Order not found',
      });
    }

    await PurchaseOrder.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Purchase Order deleted successfully',
    });
  } catch (err) {
    console.error(
      'DELETE PURCHASE ORDER ERROR:',
      err,
    );

    res.status(500).json({
      message: err.message,
    });
  }
};