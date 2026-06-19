import mongoose from "mongoose";
import { beforeEach, afterAll } from "vitest";
import "dotenv/config";

const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/todo_ts_test_db";

// Force connection string mutation down to the test database block
beforeEach(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_MONGO_URI);
  }
});

// Drop database cleanly to leave environment pristine
afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  }
});
