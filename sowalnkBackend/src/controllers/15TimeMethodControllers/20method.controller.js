import ParetoTask from "../../models/15TimeMethods/20method.model.js";

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { name, value, reminder } = req.body;

    if (!name || !value) {
      return res.status(400).json({
        success: false,
        message: "Name and value are required",
      });
    }

    const task = await ParetoTask.create({
      user: req.user._id,
      name,
      value,
      reminder: reminder ? new Date(reminder) : null,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};

// Get all tasks for a user
export const getTasks = async (req, res) => {
  try {
    const tasks = await ParetoTask.find({ user: req.user._id }).sort({
      order: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving tasks",
      error: error.message,
    });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, value, reminder, completed } = req.body;

    const task = await ParetoTask.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const updatedTask = await ParetoTask.findByIdAndUpdate(
      id,
      {
        name: name || task.name,
        value: value || task.value,
        reminder: reminder ? new Date(reminder) : task.reminder,
        completed: completed !== undefined ? completed : task.completed,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await ParetoTask.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await ParetoTask.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deleting task",
      error: error.message,
    });
  }
};

// Update task order
export const updateTaskOrder = async (req, res) => {
  try {
    const { tasks } = req.body;

    if (!Array.isArray(tasks)) {
      return res.status(400).json({
        success: false,
        message: "Tasks must be an array",
      });
    }

    const updatePromises = tasks.map((task, index) =>
      ParetoTask.findOneAndUpdate(
        { _id: task.id, user: req.user._id },
        { order: index },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    return res.status(200).json({
      success: true,
      message: "Task order updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error updating task order",
      error: error.message,
    });
  }
};

// Get task statistics
export const getTaskStats = async (req, res) => {
  try {
    const tasks = await ParetoTask.find({ user: req.user._id });

    const totalValue = tasks
      .filter((task) => !task.completed)
      .reduce((sum, task) => sum + task.value, 0);

    const sortedTasks = [...tasks]
      .filter((task) => !task.completed)
      .sort((a, b) => b.value - a.value);

    const vitalFewCount = Math.ceil(sortedTasks.length * 0.2);
    const vitalTasks = sortedTasks.slice(0, vitalFewCount);
    const trivialTasks = sortedTasks.slice(vitalFewCount);

    const vitalImpact = vitalTasks.reduce((sum, task) => sum + task.value, 0);
    const trivialImpact = trivialTasks.reduce(
      (sum, task) => sum + task.value,
      0
    );

    const stats = {
      totalTasks: tasks.length,
      incompleteTasks: tasks.filter((task) => !task.completed).length,
      completedTasks: tasks.filter((task) => task.completed).length,
      totalValue,
      vitalFewCount,
      vitalImpact,
      trivialImpact,
      vitalImpactPercentage: totalValue ? (vitalImpact / totalValue) * 100 : 0,
      trivialImpactPercentage: totalValue
        ? (trivialImpact / totalValue) * 100
        : 0,
    };

    return res.status(200).json({
      success: true,
      message: "Task statistics retrieved successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error retrieving task statistics",
      error: error.message,
    });
  }
};
