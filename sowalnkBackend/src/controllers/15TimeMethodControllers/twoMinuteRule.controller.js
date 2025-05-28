import TwoMinuteRule from "../../models/15TimeMethods/twoMinuteRule.model.js";
import { User } from "../../models/user.model.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { text, minutes } = req.body;
    const userId = req.user._id;

    // Determine status based on minutes
    const status = minutes <= 2 ? "do-now" : "deferred";

    const task = await TwoMinuteRule.create({
      user: userId,
      text,
      minutes,
      status,
    });

    // Get user's current points
    const user = await User.findById(userId);
    const totalPoints = user ? user.totalPoints || 0 : 0;

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: {
        task,
        totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error creating task",
    });
  }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await TwoMinuteRule.find({ user: userId }).sort({
      createdAt: -1,
    });

    // Get user's total points
    const user = await User.findById(userId);
    const totalPoints = user ? user.totalPoints || 0 : 0;

    res.status(200).json({
      success: true,
      data: {
        tasks,
        totalPoints,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error fetching tasks",
    });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { completed } = req.body;
    const userId = req.user._id;

    const task = await TwoMinuteRule.findOne({ _id: taskId, user: userId });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // If task is being marked as completed
    if (completed && !task.completed) {
      // Update user points
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const pointsToAdd = 2;
      // Update positivePoints instead of totalPoints
      user.positivePoints = (user.positivePoints || 0) + pointsToAdd;
      await user.save();

      // Update task points and completion status
      task.completed = true;
      task.points = pointsToAdd;
      await task.save();

      console.log("Updated user points:", user.totalPoints); // Debug log

      return res.status(200).json({
        success: true,
        message: "Task completed successfully",
        data: {
          task,
          points: pointsToAdd,
          totalPoints: user.totalPoints,
        },
      });
    } else if (!completed && task.completed) {
      // If task is being unmarked as completed
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Remove points when uncompleting a task
      const pointsToRemove = 2;
      // Update positivePoints instead of totalPoints
      user.positivePoints = Math.max(
        0,
        (user.positivePoints || 0) - pointsToRemove
      );
      await user.save();

      // Update task status
      task.completed = false;
      task.points = 0;
      await task.save();

      console.log("Updated user points after uncomplete:", user.totalPoints); // Debug log

      return res.status(200).json({
        success: true,
        message: "Task uncompleted successfully",
        data: {
          task,
          points: -pointsToRemove,
          totalPoints: user.totalPoints,
        },
      });
    }

    // For other updates
    const updatedTask = await TwoMinuteRule.findByIdAndUpdate(
      taskId,
      { ...req.body },
      { new: true }
    );

    // Get updated user points
    const user = await User.findById(userId);
    const totalPoints = user ? user.totalPoints || 0 : 0;

    console.log("Final total points:", totalPoints); // Debug log

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: {
        task: updatedTask,
        totalPoints,
      },
    });
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Error updating task",
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await TwoMinuteRule.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Error deleting task",
    });
  }
};
