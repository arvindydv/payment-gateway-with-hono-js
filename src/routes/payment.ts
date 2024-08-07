import { Hono } from "hono";
import {
  createPayment,
  getAllPayments,
  getPaymentStatus,
  processPayment,
} from "../controller/payment";
import { authMiddleware } from "../middleware/auth";

const router = new Hono();

// Apply the authentication middleware to the `/payment` route
// router.use("/payment", authMiddleware);

// Define the route and its handler
router.post("/payment", authMiddleware, createPayment);
router.patch("/process/:id", authMiddleware, processPayment);
router.get("/payment/:id", authMiddleware, getPaymentStatus);
router.get("/payments", authMiddleware, getAllPayments);

export default router;
