import mongoose from 'mongoose';
import Inventory from '../models/Inventory.js';
import Product from '../models/Product.js';

// ==========================================
// CREATE INVENTORY RECORD
// POST /api/inventory
// ==========================================

export const createInventoryRecord = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {
      product,
      quantity,
      type,
      notes,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!product) {
      await session.abortTransaction();

      return res.status(400).json({
        message: 'Product is required',
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      await session.abortTransaction();

      return res.status(400).json({
        message: 'Quantity must be a positive integer',
      });
    }

    if (!['In', 'Out'].includes(type)) {
      await session.abortTransaction();

      return res.status(400).json({
        message: 'Type must be In or Out',
      });
    }

    // ------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------

    const existingProduct =
      await Product.findById(product).session(session);

    if (!existingProduct) {
      await session.abortTransaction();

      return res.status(404).json({
        message: 'Product not found',
      });
    }

    const currentStock =
      Number(existingProduct.quantity) || 0;

    // ------------------------------------------
    // STOCK OUT VALIDATION
    // ------------------------------------------

    if (type === 'Out' && currentStock < qty) {
      await session.abortTransaction();

      return res.status(400).json({
        message:
          `Insufficient stock. Available stock: ${currentStock}`,
      });
    }

    // ------------------------------------------
    // UPDATE PRODUCT STOCK
    // ------------------------------------------

    if (type === 'In') {
      existingProduct.quantity =
        currentStock + qty;
    } else {
      existingProduct.quantity =
        currentStock - qty;
    }

    await existingProduct.save({session});

    // ------------------------------------------
    // CREATE INVENTORY HISTORY
    // ------------------------------------------

    const inventory =
      await Inventory.create(
        [
          {
            product,
            quantity: qty,
            type,
            notes: notes?.trim() || '',
          },
        ],
        {session},
      );

    await session.commitTransaction();

    // ------------------------------------------
    // RETURN POPULATED RECORD
    // ------------------------------------------

    const populatedInventory =
      await Inventory.findById(
        inventory[0]._id,
      ).populate('product');

    return res.status(201).json({
      message:
        'Inventory updated successfully',
      inventory: populatedInventory,
    });

  } catch (error) {
    await session.abortTransaction();

    console.error(
      'CREATE INVENTORY ERROR:',
      error,
    );

    return res.status(500).json({
      message: error.message,
    });
  } finally {
    session.endSession();
  }
};


// ==========================================
// GET INVENTORY HISTORY
// GET /api/inventory
// ==========================================

export const getInventoryHistory = async (
  req,
  res,
) => {
  try {
    const history =
      await Inventory.find()
        .populate('product')
        .sort({
          createdAt: -1,
        });

    return res.status(200).json(history);

  } catch (error) {
    console.error(
      'GET INVENTORY ERROR:',
      error,
    );

    return res.status(500).json({
      message: error.message,
    });
  }
};


// ==========================================
// UPDATE INVENTORY RECORD
// PUT /api/inventory/:id
// ==========================================

export const updateInventoryRecord = async (
  req,
  res,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {id} = req.params;

    const {
      product,
      quantity,
      type,
      notes,
    } = req.body;

    // ------------------------------------------
    // VALIDATION
    // ------------------------------------------

    if (!product) {
      await session.abortTransaction();

      return res.status(400).json({
        message: 'Product is required',
      });
    }

    const qty = Number(quantity);

    if (!Number.isInteger(qty) || qty <= 0) {
      await session.abortTransaction();

      return res.status(400).json({
        message:
          'Quantity must be a positive integer',
      });
    }

    if (!['In', 'Out'].includes(type)) {
      await session.abortTransaction();

      return res.status(400).json({
        message: 'Type must be In or Out',
      });
    }

    // ------------------------------------------
    // FIND INVENTORY RECORD
    // ------------------------------------------

    const inventory =
      await Inventory.findById(id)
        .session(session);

    if (!inventory) {
      await session.abortTransaction();

      return res.status(404).json({
        message:
          'Inventory record not found',
      });
    }

    // ------------------------------------------
    // FIND OLD PRODUCT
    // ------------------------------------------

    const oldProduct =
      await Product.findById(
        inventory.product,
      ).session(session);

    if (!oldProduct) {
      await session.abortTransaction();

      return res.status(404).json({
        message:
          'Old product not found',
      });
    }

    // ------------------------------------------
    // FIND NEW PRODUCT BEFORE CHANGING STOCK
    // ------------------------------------------

    const newProduct =
      await Product.findById(product)
        .session(session);

    if (!newProduct) {
      await session.abortTransaction();

      return res.status(404).json({
        message:
          'New product not found',
      });
    }

    // ------------------------------------------
    // OLD MOVEMENT INFORMATION
    // ------------------------------------------

    const oldQty =
      Number(inventory.quantity) || 0;

    const oldType =
      inventory.type;

    const oldProductId =
      oldProduct._id.toString();

    const newProductId =
      newProduct._id.toString();

    // ------------------------------------------
    // SAME PRODUCT
    // ------------------------------------------

    if (oldProductId === newProductId) {

      let stock =
        Number(oldProduct.quantity) || 0;

      // Reverse old movement
      if (oldType === 'In') {
        stock -= oldQty;
      } else {
        stock += oldQty;
      }

      if (stock < 0) {
        stock = 0;
      }

      // Apply new movement
      if (type === 'Out') {

        if (stock < qty) {
          await session.abortTransaction();

          return res.status(400).json({
            message:
              `Insufficient stock. Available stock: ${stock}`,
          });
        }

        stock -= qty;

      } else {

        stock += qty;
      }

      newProduct.quantity = stock;

      await newProduct.save({session});
    }

    // ------------------------------------------
    // DIFFERENT PRODUCT
    // ------------------------------------------

    else {

      let oldStock =
        Number(oldProduct.quantity) || 0;

      // Reverse old movement
      if (oldType === 'In') {
        oldStock -= oldQty;
      } else {
        oldStock += oldQty;
      }

      if (oldStock < 0) {
        oldStock = 0;
      }

      oldProduct.quantity = oldStock;

      await oldProduct.save({session});

      // ----------------------------------------
      // APPLY NEW MOVEMENT TO NEW PRODUCT
      // ----------------------------------------

      let newStock =
        Number(newProduct.quantity) || 0;

      if (type === 'Out') {

        if (newStock < qty) {
          await session.abortTransaction();

          return res.status(400).json({
            message:
              `Insufficient stock. Available stock: ${newStock}`,
          });
        }

        newStock -= qty;

      } else {

        newStock += qty;
      }

      newProduct.quantity = newStock;

      await newProduct.save({session});
    }

    // ------------------------------------------
    // UPDATE INVENTORY HISTORY
    // ------------------------------------------

    inventory.product = product;
    inventory.quantity = qty;
    inventory.type = type;
    inventory.notes = notes?.trim() || '';

    await inventory.save({session});

    await session.commitTransaction();

    // ------------------------------------------
    // RETURN UPDATED RECORD
    // ------------------------------------------

    const updatedInventory =
      await Inventory.findById(id)
        .populate('product');

    return res.status(200).json({
      message:
        'Inventory updated successfully',
      inventory: updatedInventory,
    });

  } catch (error) {

    await session.abortTransaction();

    console.error(
      'UPDATE INVENTORY ERROR:',
      error,
    );

    return res.status(500).json({
      message: error.message,
    });

  } finally {
    session.endSession();
  }
};


// ==========================================
// DELETE INVENTORY RECORD
// DELETE /api/inventory/:id
// ==========================================

export const deleteInventoryRecord = async (
  req,
  res,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const {id} = req.params;

    // ------------------------------------------
    // FIND INVENTORY
    // ------------------------------------------

    const inventory =
      await Inventory.findById(id)
        .session(session);

    if (!inventory) {
      await session.abortTransaction();

      return res.status(404).json({
        message:
          'Inventory record not found',
      });
    }

    // ------------------------------------------
    // FIND PRODUCT
    // ------------------------------------------

    const product =
      await Product.findById(
        inventory.product,
      ).session(session);

    // ------------------------------------------
    // REVERSE STOCK
    // ------------------------------------------

    if (product) {

      let stock =
        Number(product.quantity) || 0;

      if (inventory.type === 'In') {
        stock -= Number(
          inventory.quantity,
        );
      } else {
        stock += Number(
          inventory.quantity,
        );
      }

      if (stock < 0) {
        stock = 0;
      }

      product.quantity = stock;

      await product.save({session});
    }

    // ------------------------------------------
    // DELETE HISTORY
    // ------------------------------------------

    await Inventory.findByIdAndDelete(
      id,
      {session},
    );

    await session.commitTransaction();

    return res.status(200).json({
      message:
        'Inventory history record deleted',
    });

  } catch (error) {

    await session.abortTransaction();

    console.error(
      'DELETE INVENTORY ERROR:',
      error,
    );

    return res.status(500).json({
      message: error.message,
    });

  } finally {
    session.endSession();
  }
};