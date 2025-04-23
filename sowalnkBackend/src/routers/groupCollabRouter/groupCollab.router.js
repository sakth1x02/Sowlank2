import express from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { groupCollaboration } from "../../controllers/groupCollabContr/grouptask.controller.js";
const router = express.Router();
router.use(verifyJWT);
//create new task
router.post("/", groupCollaboration.addTask);
//fetch all task
router.get("/", groupCollaboration.getTask);
//update the task
router.patch("/:id/status", groupCollaboration.updateTask);
//delete task
router.delete("/:id", groupCollaboration.deleteTask);
export default router;
