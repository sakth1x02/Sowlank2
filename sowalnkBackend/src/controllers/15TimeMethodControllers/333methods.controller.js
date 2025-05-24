import {
  ThreeThreeThreeTask,
  ThreeThreeThreeSession,
} from "../../models/15TimeMethods/333methods.model.js";

// Task Controllers
const createTask = async (req, res) => {
  try {
    const { text, category } = req.body;
    const userId = req.user._id;

    if (!text?.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Task text is required" });
    }

    if (!["deep", "short", "maintenance"].includes(category)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task category" });
    }

    const task = await ThreeThreeThreeTask.create({
      user: userId,
      text: text.trim(),
      category,
    });

    return res.status(201).json({
      success: true,
      data: { task },
      message: "Task created successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category } = req.query;

    const query = { user: userId };
    if (category) {
      if (!["deep", "short", "maintenance"].includes(category)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid task category" });
      }
      query.category = category;
    }

    const tasks = await ThreeThreeThreeTask.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: { tasks },
      message: "Tasks fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { text, completed, timeSpent } = req.body;
    const userId = req.user._id;

    const task = await ThreeThreeThreeTask.findOne({
      _id: taskId,
      user: userId,
    });
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // Update task fields if they are provided
    if (text !== undefined) task.text = text;
    if (completed !== undefined) task.completed = completed;
    if (timeSpent !== undefined) task.timeSpent = timeSpent;

    await task.save();

    return res.status(200).json({
      success: true,
      data: task,
      message: "Task updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user._id;

    const task = await ThreeThreeThreeTask.findOneAndDelete({
      _id: taskId,
      user: userId,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    return res.status(200).json({
      success: true,
      data: {},
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Session Controllers
const createSession = async (req, res) => {
  try {
    const {
      deepCount,
      shortCount,
      maintenanceCount,
      totalTimeSpent,
      points,
      completedTasks,
    } = req.body;
    const userId = req.user._id;

    const session = await ThreeThreeThreeSession.create({
      user: userId,
      deepCount,
      shortCount,
      maintenanceCount,
      totalTimeSpent,
      points,
      completedTasks,
    });

    return res.status(201).json({
      success: true,
      data: session,
      message: "Session recorded successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getSessions = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessions = await ThreeThreeThreeSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("completedTasks");

    return res.status(200).json({
      success: true,
      data: sessions,
      message: "Sessions fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  createSession,
  getSessions,
};
