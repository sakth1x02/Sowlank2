import { Router } from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  createSession,
  getSessions,
} from "../../controllers/15TimeMethodControllers/333methods.controller.js";
import { verifyJWT } from "../../middleware/auth.middleware.js";
const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// Task routes
router.route("/tasks").post(createTask).get(getTasks);
router.route("/tasks/:taskId").put(updateTask).delete(deleteTask);

// Session routes
router.route("/sessions").post(createSession).get(getSessions);

export default router;
