import { Context } from "hono";
import { getPaymentById, updatePaymentInDB } from "../models/payment"; // Adjust import paths as needed
import { createRefund, Refund } from "../models/refund"; // Adjust import paths as needed
import { ObjectId } from "mongodb"; // Import ObjectId
// import { generateUniqueId } from "../utils"; // Import your unique ID generator function

const refundPayment = async (c: Context) => {
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

    // Check if the payment is eligible for refund
    if (payment.status !== "completed") {
      return c.json({ message: "Payment not eligible for refund" }, 400);
    }

    // Create a refund
    // const transactionId = generateUniqueId();
    const refund: Refund = {
      paymentId: new ObjectId(paymentId),
      amount: payment.amount,
      status: "completed",
      transactionId,
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
