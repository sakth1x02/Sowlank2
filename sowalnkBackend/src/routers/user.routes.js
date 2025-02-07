import { Router } from "express";
import { userAuthentication } from "../controllers/user.controller.js";
const router = Router();

router.post("/signup", userAuthentication.signupUser);
router.post("/login", userAuthentication.loginUser);
router.get("/users", userAuthentication.getAllUsers);
router.post("/update-points", userAuthentication.updateTaskPoints);

export default router;
