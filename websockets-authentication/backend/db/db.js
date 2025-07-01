import mongoose from "mongoose";
import dotenv from "dotenv";

// loads the variables defined in .env file into the app's environment, so can be accessed them via process.env
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;