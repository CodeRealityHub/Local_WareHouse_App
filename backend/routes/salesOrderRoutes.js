import express from 'express';
import {
  createSalesOrder,
  getSalesOrders,
  updateSalesOrder,
  updateSalesOrderStatus,
  deleteSalesOrder,
} from '../controllers/salesOrderControllers.js';

const router = express.Router();

// ==========================================
// SALES ORDER ROUTES
// ==========================================

// POST /api/sales-orders
router.post('/', createSalesOrder);

// GET /api/sales-orders
router.get('/', getSalesOrders);

// PUT /api/sales-orders/:id (Full update)
router.put('/:id', updateSalesOrder);

// PUT /api/sales-orders/:id/status (Status specific update)
router.put('/:id/status', updateSalesOrderStatus);

// DELETE /api/sales-orders/:id
router.delete('/:id', deleteSalesOrder);

export default router;