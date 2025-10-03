import mongoose from "mongoose";

let isConnected = false;

/**
 * Connects to MongoDB using Mongoose
 * Uses a singleton pattern to avoid multiple connections
 */
export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define MONGODB_URI in your .env file");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      // optional settings
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}
