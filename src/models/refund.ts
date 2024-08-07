// models/refund.ts
import { getDB } from "../db/db";
import { ObjectId } from "mongodb";

interface Refund {
  _id?: ObjectId;
  paymentId: ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed";
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Function to create a new refund
async function createRefund(refund: Refund): Promise<Refund> {
  const db = getDB();
  const result = await db.collection("refunds").insertOne(refund);
  return db.collection<Refund>("refunds").findOne({ _id: result.insertedId });
}

// Function to get a refund by its ID
async function getRefundById(id: string): Promise<Refund | null> {
  const db = getDB();
  return db.collection<Refund>("refunds").findOne({ _id: new ObjectId(id) });
}

// Function to get refunds by payment ID
async function getRefundsByPaymentId(paymentId: string): Promise<Refund[]> {
  const db = getDB();
  return db
    .collection<Refund>("refunds")
    .find({ paymentId: new ObjectId(paymentId) })
    .toArray();
}

// Function to update a refund by its ID
async function updateRefundInDB(refund: Refund): Promise<Refund | null> {
  const db = getDB();
  const { _id, ...updateData } = refund;
  await db
    .collection("refunds")
    .updateOne({ _id: new ObjectId(_id) }, { $set: updateData });
  return db.collection<Refund>("refunds").findOne({ _id: new ObjectId(_id) });
}

export {
  createRefund,
  getRefundById,
  getRefundsByPaymentId,
  updateRefundInDB,
  Refund,
};
