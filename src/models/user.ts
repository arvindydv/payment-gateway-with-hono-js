// models/user.ts
import { getDB } from "../db/db";
import { ObjectId } from "mongodb";
import bcryptjs from "bcryptjs";

interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
}

async function getUserByEmail(email: string): Promise<User | null> {
  const db = getDB();
  return db.collection<User>("users").findOne({ email });
}

async function createUser(user: User): Promise<User> {
  const db = getDB();
  const result = await db.collection("users").insertOne(user);
  return db.collection<User>("users").findOne({ _id: result.insertedId });
}

async function getUserById(id: string): Promise<User | null> {
  const db = getDB();
  return db.collection<User>("users").findOne({ _id: new ObjectId(id) });
}

export { getUserByEmail, createUser, getUserById, User };
