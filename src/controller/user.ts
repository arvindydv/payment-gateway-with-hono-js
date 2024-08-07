import bcrypt from "bcryptjs";
import { Context } from "hono";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { getUserByEmail, createUser, User } from "../models/user";

// Define Zod schema for the request payload
const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// login schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// generate tokens
async function generateAccessAndRefreshTokens(userId: string) {
  const accessToken = jwt.sign(
    { id: userId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "1h",
    }
  );

  return { accessToken };
}

// register controller
async function register(c: Context) {
  console.log("register");
  const result = registerSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ errors: result.error.errors }, 400);
  }

  const { name, email, password } = result.data;
  const user = await getUserByEmail(email);

  console.log("register", name, email, password);

  if (user) return c.json({ message: "User already exists" }, 400);

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { name, email, password: hashedPassword };
  const createdUser = await createUser(newUser);

  return c.json(createdUser, 201);
}

// login controller
async function login(c: Context) {
  // Parse and validate the request payload
  const result = loginSchema.safeParse(await c.req.json());

  if (!result.success) {
    return c.json({ errors: result.error.errors }, 400);
  }

  const { email, password } = result.data;
  const user = await getUserByEmail(email);

  if (!user) return c.json({ message: "User not found" }, 404);

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return c.json({ message: "Invalid credentials" }, 401);

  const { accessToken } = await generateAccessAndRefreshTokens(
    user._id.toString()
  );

  // Set cookies
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production, false for local development
  };

  c.res.headers.set(
    "Set-Cookie",
    `accessToken=${accessToken}; HttpOnly; ${options.secure ? "Secure" : ""}`
  );

  return c.json(
    {
      user: { _id: user._id, name: user.name, email: user.email },
      accessToken,
    },
    200
  );
}

export { register, login };
