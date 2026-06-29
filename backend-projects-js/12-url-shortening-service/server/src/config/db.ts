import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const mongoURI =
    process.env.MONGO_URI || "mongodb://localhost:27017/url_shortener";

  const conn = await mongoose.connect(mongoURI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
