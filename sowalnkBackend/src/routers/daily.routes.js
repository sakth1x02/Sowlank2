import { Router } from "express";
import { dailyTaskController } from "../controllers/daily.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

// router.route("/daily").post(dailyTaskController.createTask);
router.post("/daily", dailyTaskController.createTask);
router.get("/daily", dailyTaskController.getAllTasks);
router.patch("/daily/:id/toggle", dailyTaskController.toggleTaskCompletion);
// router.get("/daily/:id", dailyTaskController.getTaskById);
// router.put("/daily/:id", dailyTaskController.updateTask);
router.delete("/daily/:id/delete", dailyTaskController.deleteTask);
router.post(
  "/daily/:id/upload",
  upload.single("file"),
  dailyTaskController.uploadFileController
);
export default router;
