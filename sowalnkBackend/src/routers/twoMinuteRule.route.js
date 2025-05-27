import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/15TimeMethodControllers/TwoMinuteRule.controller.js";

const router = express.Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Task routes
router.post("/tasks", createTask);
router.get("/tasks", getTasks);
router.put("/tasks/:taskId", updateTask);
router.delete("/tasks/:taskId", deleteTask);

export default router;
