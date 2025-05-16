import { EisenhowerTask } from "../../models/15TimeMethods/eisenHower.model.js";

// Create a new task
const createTask = async (req, res) => {
  try {
    const { text, quadrant } = req.body;
    const userId = req.user._id;

    if (!text || !quadrant) {
      return res.status(400).json({
        success: false,
        message: "Text and quadrant are required",
      });
    }

    const task = await EisenhowerTask.create({
      user: userId,
      text,
      quadrant,
    });

    // Update points and check for badges
    const userTasks = await EisenhowerTask.find({ user: userId });
    const totalTasks = userTasks.length;
    const quadrantTasks = {
      do: userTasks.filter((t) => t.quadrant === "do").length,
      decide: userTasks.filter((t) => t.quadrant === "decide").length,
      delegate: userTasks.filter((t) => t.quadrant === "delegate").length,
      delete: userTasks.filter((t) => t.quadrant === "delete").length,
    };

    let points = 10; // Base points for adding a task
    let badges = [];

    // Check for Task Starter badge
    if (totalTasks >= 5) {
      badges.push("Task Starter");
    }

    // Update points and badges
    const updatedTask = await EisenhowerTask.findByIdAndUpdate(
      task._id,
      {
        $inc: { points: points },
        $addToSet: { badges: { $each: badges } },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      data: updatedTask,
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
    const tasks = await EisenhowerTask.find({ user: userId }).sort({
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

    const task = await EisenhowerTask.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update points and check for badges
    const userTasks = await EisenhowerTask.find({ user: userId });
    const quadrantTasks = {
      do: userTasks.filter((t) => t.quadrant === "do").length,
      decide: userTasks.filter((t) => t.quadrant === "decide").length,
      delegate: userTasks.filter((t) => t.quadrant === "delegate").length,
      delete: userTasks.filter((t) => t.quadrant === "delete").length,
    };

    let points = 25; // Points for deleting a task
    let badges = [];

    // Check for Quadrant Master badges
    Object.entries(quadrantTasks).forEach(([quadrant, count]) => {
      if (count === 0) {
        badges.push(`Quadrant Master: ${quadrant}`);
      }
    });

    // Calculate total points and level
    const totalPoints =
      userTasks.reduce((sum, task) => sum + (task.points || 0), 0) + points;
    const level = Math.floor(totalPoints / 100) + 1;

    if (level >= 5) {
      badges.push("Eisenhower Pro");
    }

    return res.status(200).json({
      success: true,
      data: {
        task,
        points: totalPoints,
        badges: [...new Set(badges)],
        level,
      },
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

const updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { isCompleted } = req.body;
    const userId = req.user._id;

    // Find the task before updating to check current status
    const taskBeforeUpdate = await EisenhowerTask.findOne({
      _id: taskId,
      user: userId,
    });

    if (!taskBeforeUpdate) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Add points only if completing the task and it wasn't already completed
    let pointsEarned = 0;
    if (isCompleted && !taskBeforeUpdate.isCompleted) {
      pointsEarned = 5; // Points for completing a task
    }

    const task = await EisenhowerTask.findOneAndUpdate(
      { _id: taskId, user: userId },
      { isCompleted, $inc: { points: pointsEarned } }, // Increment points only if earned
      { new: true }
    );

    if (!task) {
      // Should not happen if taskBeforeUpdate was found, but good practice
      return res.status(404).json({
        success: false,
        message: "Task not found after attempted update",
      });
    }

    // Recalculate total points, level, and badges for the user
    const userTasks = await EisenhowerTask.find({ user: userId });
    const totalPoints = userTasks.reduce((sum, t) => sum + (t.points || 0), 0);
    const calculatedLevel = Math.floor(totalPoints / 100) + 1;

    // Recalculate badges based on current task state (optional, depending on badge logic)
    // For now, let's just include all existing badges from all tasks
    const allBadges = userTasks.reduce((acc, t) => {
      if (t.badges && Array.isArray(t.badges)) {
        return [...acc, ...t.badges];
      }
      return acc;
    }, []);
    const uniqueBadges = [...new Set(allBadges)];

    return res.status(200).json({
      success: true,
      data: {
        task, // Return the updated task details
        points: totalPoints, // Return the updated total points
        level: calculatedLevel, // Return the updated level
        badges: uniqueBadges, // Return the updated badges
      },
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

export { createTask, getTasks, deleteTask, updateTaskStatus };
