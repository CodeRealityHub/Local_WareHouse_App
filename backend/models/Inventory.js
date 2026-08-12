import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  type: { type: String, enum: ['In', 'Out'], required: true },
  date: { type: Date, default: Date.now },
  notes: { type: String }
}, { timestamps: true });

const Inventory = new mongoose.model("Inventory", inventorySchema);
export default Inventory;