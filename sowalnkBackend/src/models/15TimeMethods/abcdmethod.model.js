import mongoose from "mongoose";

const abcdeTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    priority: {
      type: String,
      enum: ["A", "B", "C", "D", "E"],
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const userPointsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const ABCDETask = mongoose.model("ABCDETask", abcdeTaskSchema);
export const UserPoints = mongoose.model("UserPoints", userPointsSchema);
