// models/payment.ts
import { getDB } from "../db/db";
import { ObjectId } from "mongodb";

interface Payment {
  _id?: ObjectId;
  userId: ObjectId;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Function to create a new payment
async function createPayment(payment: Payment): Promise<Payment> {
  const db = getDB();
  const result = await db.collection("payments").insertOne(payment);
  return db.collection<Payment>("payments").findOne({ _id: result.insertedId });
}

// Function to get a payment by its ID
async function getPaymentById(id: string): Promise<Payment | null> {
  const db = getDB();
  return db.collection<Payment>("payments").findOne({ _id: new ObjectId(id) });
}

// Function to get payments by user ID
async function getPaymentsByUserId(userId: string): Promise<Payment[]> {
  const db = getDB();
  return db
    .collection<Payment>("payments")
    .find({ userId: new ObjectId(userId) })
    .toArray();
}

// Function to update a payment by its ID
async function updatePaymentInDB(payment: Payment): Promise<Payment | null> {
  const db = getDB();
  const { _id, ...updateData } = payment;
  await db
    .collection("payments")
    .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
  return db.collection<Payment>("payments").findOne({ _id: new ObjectId(_id) });
}

export {
  createPayment,
  getPaymentById,
  getPaymentsByUserId,
  updatePaymentInDB,
  Payment,
};
