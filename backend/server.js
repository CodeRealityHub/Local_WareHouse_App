import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/index.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import customerRoutes from './routes/customerRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import purchaseOrderRoutes from './routes/purchaseOrdersRoutes.js';
import salesOrderRoutes from './routes/salesOrderRoutes.js';
import supplierRoutes from './routes/supplierRoutes.js';
import reportRoutes from './routes/reportRoutes.js';


dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/dashboard", dashboardRoutes); // Fixed typo from 'dashbaord' to 'dashboard'
app.use("/api/inventory", inventoryRoutes);
app.use('/api/products', productRoutes);
app.use("/api/product", productRoutes);
app.use("/api/customers", customerRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/sales-orders', salesOrderRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});