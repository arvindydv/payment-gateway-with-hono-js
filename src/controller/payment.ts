// controllers/payment.ts
import { Context } from "hono";
import { z } from "zod";
import { createPayment as createPaymentInDB, Payment } from "../models/payment";
import { getPaymentById, updatePaymentInDB, getPaymentsByUserId } from "../models/payment";
import { ObjectId } from "mongodb";

// payment schema
const paymentSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than zero"),
  currency: z.string().min(1, "Currency is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
});

// Create payment
async function createPayment(c: Context) {
  try {
    
    const result = paymentSchema.safeParse(await c.req.json());
    console.log(c.user, "+++++++++++");
    if (!result.success) {
      return c.json({ errors: result.error.errors }, 400);
    }
    // console.log(c.req, "rrrrrrrrr");

    const { amount, currency, paymentMethod } = result.data;

    if (!c.user) {
      return c.json({ message: "User is not authenticated" }, 401);
    }

    // Create the payment object
    const payment: Payment = {
      userId: new ObjectId(c.user._id),
      amount,
      currency,
      paymentMethod,
      status: "pending",
    };

    const createdPayment = await createPaymentInDB(payment);

    return c.json(createdPayment, 201);
  } catch (error) {
    console.error("Error creating payment:", error);
    return c.json(
      { message: "An error occurred while creating the payment" },
      500
    );
  }
}

// proccess payment
const processPayment = async (c: Context) => {
  try {
    const paymentId = c.req.param("id");

    if (!paymentId) {
      return c.json({ message: "Payment ID is required" }, 400);
    }

    const payment = await getPaymentById(paymentId);

    // Check if the payment exists and if the user is authorized
    if (!payment || payment.userId.toString() !== c.user?._id.toString()) {
      return c.json(
        { message: "Payment not found or user not authorized" },
        404
      );
    }

    payment.status = "completed";

    // Save the updated payment back to the database
    const updatedPayment = await updatePaymentInDB(payment);

    return c.json(
      {
        message: "Transaction completed successfully",
        payment: updatedPayment,
      },
      200
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    return c.json(
      { message: "An error occurred while processing the payment" },
      500
    );
  }
};

// get payment status by  id
const getPaymentStatus = async (c: Context) => {
    try {
      const paymentId = c.req.param("id");
  
      if (!paymentId) {
        return c.json({ message: "Payment ID is required" }, 400);
      }
  
      const payment = await getPaymentById(paymentId);
  
      if (!payment || payment.userId.toString() !== c.user?._id.toString()) {
        return c.json({ message: "Payment not found or user not authorized" }, 404);
      }
  
      return c.json({ message: "Payment retrieved successfully", payment }, 200);
    } catch (error) {
      console.error("Error retrieving payment status:", error);
      return c.json({ message: "An error occurred while retrieving the payment" }, 500);
    }
  };

//   get all payments 
const getAllPayments = async (c: Context) => {
    try {
      if (!c.user?._id) {
        return c.json({ message: "User is not authenticated" }, 401);
      }
  
      const payments = await getPaymentsByUserId(c.user._id);
  
      return c.json({ message: "All payments retrieved successfully", payments }, 200);
    } catch (error) {
      console.error("Error retrieving payments:", error);
      return c.json({ message: "An error occurred while retrieving payments" }, 500);
    }
  };

export { createPayment, processPayment, getPaymentStatus, getAllPayments };
