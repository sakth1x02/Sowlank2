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

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: { task },
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

    res.status(200).json({
      success: true,
      data: { tasks },
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
      user.points = (user.points || 0) + 2;
      await user.save();

      task.completed = true;
      await task.save();

      return res.status(200).json({
        success: true,
        message: "Task completed successfully",
        data: {
          task,
          points: 2,
          totalPoints: user.points,
        },
      });
    }

    // For other updates
    const updatedTask = await TwoMinuteRule.findByIdAndUpdate(
      taskId,
      { ...req.body },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: { task: updatedTask },
    });
  } catch (error) {
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
