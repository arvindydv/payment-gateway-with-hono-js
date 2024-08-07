import { Context } from "hono";
import jwt from "jsonwebtoken";

interface AuthContext extends Context {
  user?: { id: string }; // Extend this based on your user data
}

const authMiddleware = async (c: AuthContext, next: () => Promise<void>) => {
  try {
    // Access token from cookies or headers

    // const cookieToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjJmNzZhZjAwNDUwODM5M2M4MDBjYyIsImlhdCI6MTcyMzAwODAyNSwiZXhwIjoxNzIzMDExNjI1fQ.QFIKLPUECnpYK0teUmzUsGbv1RXXCqxqis1BcPFI0Yg"
    // const headerToken = c.req.headers
    //   .get("Authorization")
    //   ?.replace("Bearer ", "");
    // const token = cookieToken || headerToken;
    let token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YjJmNzZhZjAwNDUwODM5M2M4MDBjYyIsImlhdCI6MTcyMzAwOTQ1NywiZXhwIjoxNzIzMDEzMDU3fQ.EHihn9TXytqcZh2FSCwhhX7VPIulAhnlPlBPjU2hO78";

    if (!token) {
      return c.json({ message: "No token provided" }, 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      _id: string;
    };
    console.log(decoded.id, "dddddd>>>>>>>>>>>>");
    c.user = { _id: decoded.id };

    await next();
  } catch (error) {
    console.error("Authentication error:", error);
    return c.json({ message: "Invalid or expired token" }, 401);
  }
};

export { authMiddleware };
