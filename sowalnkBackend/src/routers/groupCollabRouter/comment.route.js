import express from "express";
import { verifyJWT } from "../../middleware/auth.middleware.js";
import { commentController } from "../../controllers/groupCollabContr/comment.controller.js";

const router = express.Router();

router.use(verifyJWT);

// Add comment to task
router.post("/", commentController.addComment);

// Update comment
router.patch("/:commentId", commentController.updateComment);

// Delete comment
router.delete("/:commentId", commentController.deleteComment);

// Get task comments
router.get("/task/:taskId", commentController.getTaskComments);

export default router;
