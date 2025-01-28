import { Router } from "express";
import { userAuthentication } from "../controllers/user.controller.js";
const router = Router();

router.post("/signup", userAuthentication.signupUser);
router.post("/login", userAuthentication.loginUser);

export default router;
