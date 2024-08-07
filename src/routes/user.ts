import { Hono } from "hono";
import { login, register } from "../controller/user";

const router = new Hono();

router.post("/register", register);
router.post("/login", login);

export default router;
