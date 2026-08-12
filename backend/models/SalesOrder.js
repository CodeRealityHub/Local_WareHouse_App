import mongoose from "mongoose";

const salesOrderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

const SalesOrder = new mongoose.model("SalesOrder", salesOrderSchema);
export default SalesOrder;