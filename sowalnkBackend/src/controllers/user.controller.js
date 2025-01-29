import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

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
};

export { userAuthentication };
