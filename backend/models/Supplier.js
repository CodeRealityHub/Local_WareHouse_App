import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true }
}, { timestamps: true });

const Supplier = mongoose.model("Supplier", supplierSchema);
export default Supplier;