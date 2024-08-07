// db/db.ts
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1); // Exit the process with an error
  }
}

function getDB() {
  return mongoose.connection.db;
}

export { connectDB, getDB };
