import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Ensure it looks for MONGO_URI, not undefined
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;