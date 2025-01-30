import { Router } from "express";
import { weeklyTaskController } from "../controllers/weekly.controller.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();
router.post("/weekly", weeklyTaskController.createTask);
router.get("/weekly", weeklyTaskController.getAllTasks);
router.patch("/weekly/:id/toggle", weeklyTaskController.toggleTaskCompletion);
router.delete("/weekly/:id/delete", weeklyTaskController.deleteTask);
router.post(
  "/weekly/:id/upload",
  upload.single("file"),
  weeklyTaskController.uploadFileController
);
export default router;
