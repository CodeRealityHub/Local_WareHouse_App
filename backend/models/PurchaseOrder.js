import mongoose from "mongoose";

const purchaseOrderSchema = new mongoose.Schema({
  supplier: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' }
}, { timestamps: true });

const PurchaseOrder = new mongoose.model("PurchaseOrder", purchaseOrderSchema);
export default PurchaseOrder;