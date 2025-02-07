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
