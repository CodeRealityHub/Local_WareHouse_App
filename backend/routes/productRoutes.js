import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../controllers/productControllers.js';

const router = express.Router();

router.post('/', upload.single('image'), createProduct);

router.get('/', getProducts);

router.put('/:id', upload.single('image'), updateProduct);

router.delete('/:id', deleteProduct);

export default router;