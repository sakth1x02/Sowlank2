import { Router } from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  updateTaskStatus,
  getUserPoints,
} from "../../controllers/15TimeMethodControllers/abcdmethod.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Create a new task
router.post("/", createTask);

// Get all tasks for the authenticated user
router.get("/", getTasks);

// Get user points (will now return points, level, and badges)
router.get("/points", getUserPoints);

// Delete a task
router.delete("/:taskId", deleteTask);

// Update task completion status (will now return task, points, level, and badges)
router.patch("/:taskId/status", updateTaskStatus);

export default router;
