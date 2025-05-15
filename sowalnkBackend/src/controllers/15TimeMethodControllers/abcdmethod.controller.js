import {
  ABCDETask,
  UserPoints,
} from "../../models/15TimeMethods/abcdmethod.model.js";

// Create a new task
const createTask = async (req, res) => {
  try {
    const { text, priority } = req.body;
    const userId = req.user._id;

    if (!text || !priority) {
      return res.status(400).json({
        success: false,
        message: "Text and priority are required",
      });
    }

    const task = await ABCDETask.create({
      user: userId,
      text,
      priority,
    });

    return res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully",
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

// Get all tasks for a user
const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const tasks = await ABCDETask.find({ user: userId }).sort({
      priority: 1,
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      data: tasks || [],
      message: "Tasks retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await ABCDETask.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: task,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// Get user points
const getUserPoints = async (req, res) => {
  try {
    const userId = req.user._id;
    let userPoints = await UserPoints.findOne({ user: userId });

    if (!userPoints) {
      userPoints = await UserPoints.create({
        user: userId,
        points: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: userPoints,
      message: "User points retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user points:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user points",
      error: error.message,
    });
  }
};

// Update task completion status
const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isCompleted } = req.body;
    const userId = req.user._id;

    const task = await ABCDETask.findOneAndUpdate(
      { _id: taskId, user: userId },
      { isCompleted },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update user points if task is completed
    let userPoints = await UserPoints.findOne({ user: userId });

    if (!userPoints) {
      userPoints = await UserPoints.create({
        user: userId,
        points: isCompleted ? 10 : 0,
      });
    } else if (isCompleted) {
      userPoints = await UserPoints.findOneAndUpdate(
        { user: userId },
        { $inc: { points: 10 } },
        { new: true }
      );
    }

    return res.status(200).json({
      success: true,
      data: { task, points: userPoints.points },
      message: "Task status updated successfully",
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating task status",
      error: error.message,
    });
  }
};

export { createTask, getTasks, deleteTask, updateTaskStatus, getUserPoints };
