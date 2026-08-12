import express from 'express';

import {
  createPurchaseOrder,
  getPurchaseOrders,
  updatePurchaseOrder,
  deletePurchaseOrder,
} from '../controllers/purchaseOrderControllers.js';

const router = express.Router();

// ==========================================
// PURCHASE ORDER ROUTES
// ==========================================

// POST /api/purchase-orders
router.post('/', createPurchaseOrder);

// GET /api/purchase-orders
router.get('/', getPurchaseOrders);

// PUT /api/purchase-orders/:id
router.put('/:id', updatePurchaseOrder);

// DELETE /api/purchase-orders/:id
router.delete('/:id', deletePurchaseOrder);

export default router;