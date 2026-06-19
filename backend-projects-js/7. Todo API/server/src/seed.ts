import mongoose from "mongoose";
import "dotenv/config";
import { Todo } from "./models/todo.model.js";

const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/todo_ts_db";

const seedTodos = async () => {
  try {
    await mongoose.connect(dbUri);
    console.log("📡 Connected to DB for seeding...");

    // 🚨 TARGET USER ID: Replace this string with your actual user ID from your previous test responses!
    const targetUserId = "6a342dc1f3fe0626a30d8a7f";

    console.log("🧹 Cleaning old todos for this user...");
    await Todo.deleteMany({ userId: targetUserId });

    console.log("🌱 Injecting 20 brand-new todos...");
    const dummyTodos = Array.from({ length: 20 }).map((_, index) => ({
      userId: new mongoose.Types.ObjectId(targetUserId),
      title: `Task Assignment #${index + 1}`,
      description: `Automated deep work description for task tracking number ${index + 1}.`,
    }));

    await Todo.insertMany(dummyTodos);
    console.log("🎯 Successfully seeded 20 todos! Exiting...");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedTodos();
