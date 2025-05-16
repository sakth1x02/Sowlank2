import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
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
    category: {
      type: String,
      enum: ["deep", "short", "maintenance"],
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    timeSpent: {
      type: Number,
      default: 0, // Time spent in seconds
    },
    sessionDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deepCount: {
      type: Number,
      default: 0,
    },
    shortCount: {
      type: Number,
      default: 0,
    },
    maintenanceCount: {
      type: Number,
      default: 0,
    },
    totalTimeSpent: {
      type: Number,
      default: 0, // Total time spent in seconds
    },
    points: {
      type: Number,
      default: 0,
    },
    completedTasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ThreeThreeThreeTask",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const ThreeThreeThreeTask = mongoose.model(
  "ThreeThreeThreeTask",
  taskSchema
);
export const ThreeThreeThreeSession = mongoose.model(
  "ThreeThreeThreeSession",
  sessionSchema
);
