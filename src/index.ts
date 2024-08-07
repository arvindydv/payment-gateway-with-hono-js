import { Hono } from "hono";
import dotenv from "dotenv";
import { connectDB } from "./db/db";
// import userRoutes from "./routes/user";
import authRoutes from "./routes/user";
import paymentRoutes from "./routes/payment";
import refundRoutes from "./routes/refund";

dotenv.config();
const app = new Hono();

async function startServer() {
  await connectDB(); // Wait for the database to connect
}

startServer();

app.route("/auth", authRoutes);
app.route("/payment", paymentRoutes);
app.route("/refund", refundRoutes);

// app.use("/api/users", userRoutes);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

export default app;
