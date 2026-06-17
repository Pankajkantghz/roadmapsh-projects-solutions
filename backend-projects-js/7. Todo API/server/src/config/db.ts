import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  try {
    const dbUri =
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todo_ts_db";

    const conn = await mongoose.connect(dbUri);

    console.log(
      `Connected to MongoDB successfully: ${conn.connection.host}`,
    );
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};
