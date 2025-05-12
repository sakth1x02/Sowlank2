import { Router } from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  updateTaskStatus,
} from "../../controllers/15TimeMethodControllers/eisenHower.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Create a new task
router.post("/", createTask);

// Get all tasks for the authenticated user
router.get("/", getTasks);

// Delete a task
router.delete("/:taskId", deleteTask);

// Update task completion status
router.patch("/:taskId/status", updateTaskStatus);

export default router;
