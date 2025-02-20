import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // const conn = await mongoose.connect(process.env.MONGO_URI || "");
    const conn = await mongoose.connect("mongodb://localhost:27017/authDemo", {
      serverSelectionTimeoutMS: 5001, // Retry for 5 seconds
      socketTimeoutMS: 45001, // Close sockets after 45 seconds
      family: 4, // Use IPv4 (helps with some network configurations)
    });
    
    console.log(`MongoDB Connected 💥`);
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}; 

export default connectDB;