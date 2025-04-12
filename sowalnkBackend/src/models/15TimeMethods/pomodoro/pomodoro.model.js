import { Schema, model } from "mongoose";

const pomodoroSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    text: {
      type: String,
      required: [true, "Task name is required"],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
    },
    notified: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    reminderInterval: {
      type: String,
    },
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    streak: {
      type: Number,
      default: 0,
    },
    lastStreakUpdate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Pomodoro = model("Pomodoro", pomodoroSchema);
