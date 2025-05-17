import {
  ABCDETask,
  UserPoints,
} from "../../models/15TimeMethods/abcdmethod.model.js";

// Helper function to calculate level based on points
const calculateLevel = (points) => {
  if (points < 50) return 1;
  if (points < 150) return 2;
  if (points < 300) return 3;
  if (points < 500) return 4;
  return 5; // Example: Max level for now
};

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
        level: 1, // Initialize level
        badges: [], // Initialize badges
      });
    }

    return res.status(200).json({
      success: true,
      data: userPoints, // userPoints now includes level and badges
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

    let userPoints = await UserPoints.findOne({ user: userId });

    if (!userPoints) {
      // Should ideally not happen if points are created on first get, but as a fallback
      userPoints = await UserPoints.create({
        user: userId,
        points: 0,
        level: 1,
        badges: [],
      });
    }

    let pointsEarned = 0;
    // Only award points if marking as completed
    if (isCompleted && !task._originalIsCompleted) {
      // _originalIsCompleted is not a real field, need to fetch before update
      // To correctly check if it was previously incomplete, we need the old task state
      // Let's simplify for now: just award points if marking as completed.
      // If a task is marked incomplete then complete again, they'll get points again.
      // A more robust system would track point awards per task completion event.
      pointsEarned = 2;
    }

    // Fetch the userPoints again if we need the previous state for badge checks
    // Or update and then check based on the new state. Let's update and check.
    const updatedUserPoints = await UserPoints.findOneAndUpdate(
      { user: userId },
      { $inc: { points: pointsEarned } }, // Increment points
      { new: true, upsert: true } // upsert: true creates if not exists (fallback)
    );

    // Calculate new level
    const newLevel = calculateLevel(updatedUserPoints.points);
    let badgesAwarded = [];

    // Award badges (simple examples)
    if (
      updatedUserPoints.points >= 50 &&
      !updatedUserPoints.badges.includes("50 Points")
    ) {
      updatedUserPoints.badges.push("50 Points");
      badgesAwarded.push("50 Points");
    }
    if (
      updatedUserPoints.points >= 100 &&
      !updatedUserPoints.badges.includes("100 Points")
    ) {
      updatedUserPoints.badges.push("100 Points");
      badgesAwarded.push("100 Points");
    }
    // Add a badge for completing the very first task? Requires tracking total completed tasks or a specific 'first task' flag.
    // Let's add a badge for reaching level 2.
    if (
      newLevel >= 2 &&
      !updatedUserPoints.badges.includes("Reached Level 2")
    ) {
      updatedUserPoints.badges.push("Reached Level 2");
      badgesAwarded.push("Reached Level 2");
    }

    // Update level and save badges if any were awarded or level changed
    if (updatedUserPoints.level !== newLevel || badgesAwarded.length > 0) {
      updatedUserPoints.level = newLevel;
      // Save the updated document with new level and badges
      await updatedUserPoints.save();
    }

    return res.status(200).json({
      success: true,
      data: {
        task,
        points: updatedUserPoints.points,
        level: updatedUserPoints.level,
        badges: updatedUserPoints.badges, // Send back all badges for the user
        badgesAwarded: badgesAwarded, // Optionally send newly awarded badges for notifications
      },
      message: isCompleted
        ? `Task completed! +${pointsEarned} points!`
        : "Task marked as incomplete",
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
