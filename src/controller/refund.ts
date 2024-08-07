import { Context } from "hono";
import { getPaymentById, updatePaymentInDB } from "../models/payment"; 
import { createRefund, Refund } from "../models/refund"; 
import { ObjectId } from "mongodb"; 


const refundPayment = async (c: Context) => {
  try {
    const paymentId = c.req.param("id");

    if (!paymentId) {
      return c.json({ message: "Payment ID is required" }, 400);
    }

    const payment = await getPaymentById(paymentId);

    
    if (!payment || payment.userId.toString() !== c.user?._id.toString()) {
      return c.json(
        { message: "Payment not found or user not authorized" },
        404
      );
    }

    // Check if the payment is eligible for refund
    if (payment.status !== "completed") {
      return c.json({ message: "Payment not eligible for refund" }, 400);
    }

    const refund: Refund = {
      paymentId: new ObjectId(paymentId),
      amount: payment.amount,
      status: "completed",
    };

    const createdRefund = await createRefund(refund);

    // Update payment status
    payment.status = "refunded";
    await updatePaymentInDB(payment);

    return c.json(
      { message: "Amount refunded successfully", refund: createdRefund },
      200
    );
  } catch (error) {
    console.error("Error refunding payment:", error);
    return c.json(
      { message: "An error occurred while refunding the payment" },
      500
    );
  }
};

export { refundPayment };
