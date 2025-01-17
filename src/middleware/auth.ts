import { Context } from "hono";
import jwt from "jsonwebtoken";

interface AuthContext extends Context {
  user?: { _id: string };
}

const authMiddleware = async (c: AuthContext, next: () => Promise<void>) => {
  try {
    const authHeader = c.req.raw.headers.get("Authorization");

    if (!authHeader) {
      return c.json({ message: "No authorization header provided" }, 401);
    }

    // Extract the token from the header
    const token = authHeader.replace("Bearer ", "").trim();
    console.log(token, "yttguyjgtttttttttttttt");
    if (!token) {
      return c.json({ message: "No token provided" }, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };
    console.log(decoded, "decodedddddddddddddddd");

    c.user = { _id: decoded._id };

    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ message: "Invalid or expired token" }, 401);
  }
};

export { authMiddleware };
