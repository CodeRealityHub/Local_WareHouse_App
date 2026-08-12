import express from 'express';

import {
  createInventoryRecord,
  getInventoryHistory,
  updateInventoryRecord,
  deleteInventoryRecord,
} from '../controllers/inventoryControllers.js';

const router = express.Router();

// ==========================================
// GET INVENTORY
// GET /api/inventory
// ==========================================
router.get('/', getInventoryHistory);

// ==========================================
// CREATE INVENTORY
// POST /api/inventory
// ==========================================
router.post('/', createInventoryRecord);

// ==========================================
// UPDATE INVENTORY
// PUT /api/inventory/:id
// ==========================================
router.put('/:id', updateInventoryRecord);

// ==========================================
// DELETE INVENTORY
// DELETE /api/inventory/:id
// ==========================================
router.delete('/:id', deleteInventoryRecord);

export default router;