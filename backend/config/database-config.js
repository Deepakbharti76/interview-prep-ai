import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI; // 🔥 FIX

    if (!uri) {
      throw new Error("MONGO_URI missing in .env");
    }

    await mongoose.connect(uri);

    console.log("MongoDB connected ✅");
  } catch (error) {
    console.error("MongoDB error:", error.message);
    process.exit(1);
  }
};
