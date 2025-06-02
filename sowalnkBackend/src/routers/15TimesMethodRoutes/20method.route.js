import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  updateTaskOrder,
  getTaskStats,
} from "../../controllers/15TimeMethodControllers/20method.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Task routes
router.post("/", createTask);
router.get("/", getTasks);
router.get("/stats", getTaskStats);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.patch("/order/update", updateTaskOrder);

export default router;
