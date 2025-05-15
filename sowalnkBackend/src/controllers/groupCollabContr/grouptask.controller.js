import { User } from "../../models/user.model.js";
import Task from "../../models/groupCollaboration/grouptask.model.js";
import { sendTaskInvitationEmail } from "../../mailtrap/emails.js";

const groupCollaboration = {
  //create new task
  addTask: async (req, res) => {
    try {
      const { assignees, createdBy, emailInvites, ...taskData } = req.body;

      // Validate users exist
      const creator = await User.findById(createdBy);
      if (!creator)
        return res.status(400).json({ message: "Invalid task creator" });

      // Create the task with both user IDs and email assignees
      const task = await Task.create({
        ...taskData,
        assignees,
        emailAssignees: emailInvites || [], // Store email invites separately
        createdBy,
      });

      // Send invitation emails to non-registered users
      if (emailInvites && emailInvites.length > 0) {
        try {
          const emailPromises = emailInvites.map((email) =>
            sendTaskInvitationEmail(email, task, creator.name)
          );
          await Promise.all(emailPromises);
        } catch (emailError) {
          console.error("Error sending invitation emails:", emailError);
          // Don't fail the task creation if email sending fails
        }
      }

      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: error || error.message });
    }
  },
  // Get all task
  getTask: async (req, res) => {
    try {
      const userId = req.user._id;
      const userEmail = req.user.email;

      // Find tasks where the user is either the creator, an assignee, or an email assignee
      const tasks = await Task.find({
        $or: [
          { createdBy: userId },
          { assignees: userId },
          { emailAssignees: userEmail },
        ],
      })
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
      const userId = req.user._id;
      const userEmail = req.user.email;
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Check if user is the creator, an assignee, or an email assignee
      const isCreator = task.createdBy.toString() === userId.toString();
      const isAssignee = task.assignees.some(
        (assignee) => assignee.toString() === userId.toString()
      );
      const isEmailAssignee =
        task.emailAssignees && task.emailAssignees.includes(userEmail);

      if (!isCreator && !isAssignee && !isEmailAssignee) {
        return res
          .status(403)
          .json({ message: "You don't have permission to update this task" });
      }

      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,
        { completed: req.body.completed },
        { new: true }
      );

      res.json(updatedTask);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  //delete task
  deleteTask: async (req, res) => {
    try {
      const userId = req.user._id;
      const userEmail = req.user.email;
      const task = await Task.findById(req.params.id);

      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }

      // Check if user is the creator, an assignee, or an email assignee
      const isCreator = task.createdBy.toString() === userId.toString();
      const isAssignee = task.assignees.some(
        (assignee) => assignee.toString() === userId.toString()
      );
      const isEmailAssignee =
        task.emailAssignees && task.emailAssignees.includes(userEmail);

      if (!isCreator && !isAssignee && !isEmailAssignee) {
        return res
          .status(403)
          .json({ message: "You don't have permission to delete this task" });
      }

      await Task.findByIdAndDelete(req.params.id);
      res.json({ message: "Task deleted" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
export { groupCollaboration };
