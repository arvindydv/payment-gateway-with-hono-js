import { Hono } from "hono";
import { refundPayment } from "../controller/refund";

import { authMiddleware } from "../middleware/auth";

const router = new Hono();

// Apply the authentication middleware to the `/payment` route
// router.use("/payment", authMiddleware);

// Define the route and its handler
router.post("/refund/:id", authMiddleware, refundPayment);

export default router;
