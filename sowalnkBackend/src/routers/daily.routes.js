import { Router } from "express";
import { dailyTaskController } from "../controllers/daily.controller.js";

const router = Router();

// router.route("/daily").post(dailyTaskController.createTask);
router.post("/daily", dailyTaskController.createTask);
router.get("/daily", dailyTaskController.getAllTasks);
// router.get("/daily/:id", dailyTaskController.getTaskById);
// router.put("/daily/:id", dailyTaskController.updateTask);
// router.delete("/daily/:id", dailyTaskController.deleteTask);
export default router;
