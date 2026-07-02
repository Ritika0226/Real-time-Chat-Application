import mongoose from "mongoose";

export async function connectDB() {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is required");
    }

    console.log("Connecting to:", mongoUri);

    const conn = await mongoose.connect(mongoUri);

    console.log("✅ MongoDB Connected:", conn.connection.host);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:");
    console.error(error);
    process.exit(1);
  }
}