import { DailyTask } from "../models/daily.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const dailyTaskController = {
  // Create a new task
  createTask: asyncHandler(async (req, res) => {
    try {
      const { taskName, priority, startTime, endTime, date } = req.body;

      if (!taskName || !priority || !startTime || !endTime) {
        console.error("Missing required fields");
        throw new ApiError(400, "Missing required fields");
      }

      const existedData = await DailyTask.findOne({
        taskName: taskName.trim(),
      });
      if (existedData) {
        console.error("This Data is Already existed");
        throw new ApiError(409, "This Data is Already existed");
      }

      const newTask = new DailyTask({
        taskName,
        priority,
        startTime,
        endTime,
        date,
      });

      const savedTask = await newTask.save();
      res
        .status(201)
        .json(
          new ApiResponse(200, "Task created successFull", { task: savedTask })
        );
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        res.status(400).json({ message: "Validation failed", errors });
      } else {
        res
          .status(500)
          .json({ message: "Error creating task", error: error.message });
      }
    }
  }),

  // Get all tasks
  getAllTasks: asyncHandler(async (req, res) => {
    try {
      const tasks = await DailyTask.find();
      res.status(200).json(tasks);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching tasks", error: error.message });
    }
  }),

  // Toggle task completion status
  toggleTaskCompletion: asyncHandler(async (req, res) => {
    const { id } = req.params;

    const task = await DailyTask.findById(id);

    if (!task) {
      throw new ApiError(404, "Task not found");
    }

    task.isCompleted = !task.isCompleted;
    task.progress = task.isCompleted ? 100 : 0;
    await task.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Task status updated successfully", task));
  }),

  // // Get a task by ID
  // getTaskById: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const task = await DailyTask.findById(id);

  //     if (!task) {
  //       return res.status(404).json({ message: "Task not found" });
  //     }

  //     res.status(200).json(task);
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Error fetching task", error: error.message });
  //   }
  // },

  // // Update a task by ID
  // updateTask: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const updatedTask = await DailyTask.findByIdAndUpdate(id, req.body, {
  //       new: true,
  //       runValidators: true,
  //     });

  //     if (!updatedTask) {
  //       return res.status(404).json({ message: "Task not found" });
  //     }

  //     res
  //       .status(200)
  //       .json({ message: "Task updated successfully", task: updatedTask });
  //   } catch (error) {
  //     res
  //       .status(500)
  //       .json({ message: "Error updating task", error: error.message });
  //   }
  // },

  // // Delete a task by ID
  deleteTask: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedTask = await DailyTask.findByIdAndDelete(id);

      if (!deletedTask) {
        return res.status(404).json({ message: "Task not found" });
      }

      res
        .status(200)
        .json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error deleting task", error: error.message });
    }
  },
};

export { dailyTaskController };
