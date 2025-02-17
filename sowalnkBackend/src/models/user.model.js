import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (v) {
          // At least 8 chars, 1 uppercase, 1 lowercase, 1 number
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(v);
        },
        message:
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
      },
    },
    confirmPassword: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          // Basic phone number validation (adjust regex as needed)
          return /^\+?[1-9]\d{1,14}$/.test(v); // E.164 format
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    positivePoints: {
      type: Number,
      default: 10,
    },
    negativePoints: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastTaskDate: {
      type: Date,
      default: null,
    },
    totalPoints: {
      type: Number,
      default: 10,
    },
    normalCoins: {
      type: Number,
      default: 1,
    },
    goldCoins: {
      type: Number,
      default: 1,
    },
    eliteCoins: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", function (next) {
  this.totalPoints = Math.max(0, this.positivePoints - this.negativePoints);
  next();
});

export const User = mongoose.model("User", userSchema);
