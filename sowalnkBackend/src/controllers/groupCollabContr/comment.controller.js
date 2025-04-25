import Comment from "../../models/groupCollaboration/comment.model.js";
import Task from "../../models/groupCollaboration/grouptask.model.js";

const commentController = {
  // Add comment to a task
  addComment: async (req, res) => {
    try {
      const { taskId, content, parentCommentId } = req.body;
      const userId = req.user._id;

      const task = await Task.findById(taskId);
      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }

      const isAssignee = task.assignees.some((assignee) =>
        assignee.equals(userId)
      );
      if (!task.createdBy.equals(userId) && !isAssignee) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to comment on this task",
        });
      }

      const commentData = {
        content,
        task: taskId,
        author: userId,
      };

      if (parentCommentId) {
        const parentComment = await Comment.findById(parentCommentId);
        if (!parentComment || !parentComment.task.equals(taskId)) {
          return res
            .status(400)
            .json({ success: false, message: "Invalid parent comment" });
        }
        commentData.parentComment = parentCommentId;
      }

      const comment = await Comment.create(commentData);

      if (parentCommentId) {
        await Comment.findByIdAndUpdate(parentCommentId, {
          $push: { replies: comment._id },
        });
      } else {
        await Task.findByIdAndUpdate(taskId, {
          $push: { comments: comment._id },
        });
      }

      const populatedComment = await Comment.findById(comment._id).populate(
        "author",
        "name email avatar"
      );

      return res.status(201).json({
        success: true,
        message: "Comment added successfully",
        data: populatedComment,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Update comment
  updateComment: async (req, res) => {
    try {
      const { content } = req.body;
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findOne({ _id: commentId, author: userId });
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found or unauthorized",
        });
      }

      comment.content = content;
      comment.edited = true;
      await comment.save();

      const populatedComment = await Comment.findById(comment._id).populate(
        "author",
        "name email avatar"
      );

      return res.status(200).json({
        success: true,
        message: "Comment updated successfully",
        data: populatedComment,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Delete comment
  deleteComment: async (req, res) => {
    try {
      const { commentId } = req.params;
      const userId = req.user._id;

      const comment = await Comment.findOne({ _id: commentId, author: userId });
      if (!comment) {
        return res.status(404).json({
          success: false,
          message: "Comment not found or unauthorized",
        });
      }

      const taskId = comment.task;

      await deleteCommentAndReplies(commentId);

      if (!comment.parentComment) {
        await Task.findByIdAndUpdate(taskId, {
          $pull: { comments: commentId },
        });
      } else {
        await Comment.findByIdAndUpdate(comment.parentComment, {
          $pull: { replies: commentId },
        });
      }

      return res
        .status(200)
        .json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  // Get all comments for a task
  getTaskComments: async (req, res) => {
    try {
      const { taskId } = req.params;

      const task = await Task.findById(taskId);
      if (!task) {
        return res
          .status(404)
          .json({ success: false, message: "Task not found" });
      }

      const comments = await Comment.find({ task: taskId, parentComment: null })
        .populate("author", "name email avatar")
        .populate({
          path: "replies",
          populate: { path: "author", select: "name email avatar" },
        })
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        message: "Comments retrieved successfully",
        data: comments,
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  },
};

// Helper
async function deleteCommentAndReplies(commentId) {
  const comment = await Comment.findById(commentId);
  if (!comment) return;

  for (const replyId of comment.replies) {
    await deleteCommentAndReplies(replyId);
  }

  await Comment.findByIdAndDelete(commentId);
}

export { commentController };
