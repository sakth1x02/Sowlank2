import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { DailyTask } from "../models/daily.model.js";

const userAuthentication = {
  signupUser: asyncHandler(async (req, res) => {
    // Step 1: Extract user details from the request body
    const { name, email, password, confirmPassword, phone } = req.body;

    // Step 2: Validate required fields
    if (
      [name, email, password, confirmPassword, phone].some(
        (field) => field.trim() == ""
      ) &&
      !email.include("@")
    ) {
      throw new ApiError(400, "All fields are required");
    }

    if (password !== confirmPassword) {
      throw new ApiError(400, "Password are not same");
    }

    // Step 3: Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(409, "User with this email already exists");
    }

    // Step 4: Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Create the user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
    });

    // Step 6: Remove the password from the response for security
    const createdUser = await User.findById(user._id).select("-password");

    // Step 7: Return the response
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: createdUser,
    });
  }),

  loginUser: asyncHandler(async (req, res) => {
    // Step 1: Extract email and password from the request body
    const { email, password } = req.body;

    // Step 2: Validate required fields
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Step 3: Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Step 4: Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Step 5: Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Step 6: Remove the password from the response for security
    const loggedInUser = await User.findById(user._id).select("-password");

    // Step 7: Return the response with the token
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: loggedInUser,
      token: token,
    });
  }),
  //get all users
  getAllUsers: asyncHandler(async (req, res) => {
    try {
      const users = await User.find()
        .select("-password")
        .sort({ totalPoints: -1 })
        .lean();

      // Add position based on sorted order
      const usersWithPosition = users.map((user, index) => ({
        ...user,
        position: index + 1,
      }));

      res.status(200).json({ data: usersWithPosition });
    } catch (error) {
      res.status(500).json({
        message: "Error From Fetch All Users",
        error: error.message,
      });
    }
  }),

  updateTaskPoints: asyncHandler(async (req, res) => {
    const { userId, completed, taskId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Find and update the task
    const task = await DailyTask.findById(taskId);
    if (!task || task.pointsAwarded) {
      return res.status(200).json({
        success: true,
        message: "Points already awarded",
        data: user,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (completed) {
      // Add 2 points for completion
      user.positivePoints += 2;

      // Check for streak
      if (user.lastTaskDate) {
        const lastDate = new Date(user.lastTaskDate);
        lastDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          user.streak += 1;
          if (user.streak % 5 === 0) {
            user.positivePoints += 5;
          }
        } else if (diffDays > 1) {
          user.streak = 1;
        }
      } else {
        user.streak = 1;
      }

      user.lastTaskDate = today;
    } else {
      user.negativePoints += 2;
    }

    // Mark the task as points awarded
    task.pointsAwarded = true;
    await task.save();
    await user.save();

    res.status(200).json({
      success: true,
      message: "Points updated successfully",
      data: user,
    });
  }),
};

export { userAuthentication };
