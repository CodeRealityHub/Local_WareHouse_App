import express from "express";
import { createSupplier, deleteSupplier, getSuppliers, updateSupplier } from "../controllers/supplierControllers.js";

const router = express.Router();
router.post('/', createSupplier);
router.get('/', getSuppliers);
router.put('/:id', updateSupplier);
router.delete('/:id', deleteSupplier);

export default router;