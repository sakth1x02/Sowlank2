import { User } from "../../models/user.model.js";
import Task from "../../models/groupCollaboration/grouptask.model.js";

const groupCollaboration = {
  //create new task
  addTask: async (req, res) => {
    try {
      const { assignees, createdBy, ...taskData } = req.body;

      // Validate users exist
      const creator = await User.findById(createdBy);
      if (!creator)
        return res.status(400).json({ message: "Invalid task creator" });

      // const validAssignees = await User.find({ _id: { $in: assignees } });
      // if (validAssignees.length !== assignees.length) {
      //   return res.status(400).json({ message: "Invalid assignees" });
      // }

      const task = await Task.create({
        ...taskData,
        assignees,
        createdBy,
      });

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error || error.message });
    }
  },
  // Get all task
  getTask: async (req, res) => {
    try {
      const tasks = await Task.find()
        .populate("assignees", "name email")
        .populate("createdBy", "name email");
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  //update task
  updateTask: async (req, res) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
      );
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  //delete task
  deleteTask: async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
export { groupCollaboration };
