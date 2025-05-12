import mongoose from "mongoose";

const eisenhowerTaskSchema = new mongoose.Schema(
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
    quadrant: {
      type: String,
      enum: ["do", "decide", "delegate", "delete"],
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    badges: [
      {
        type: String,
      },
    ],
    level: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

export const EisenhowerTask = mongoose.model(
  "EisenhowerTask",
  eisenhowerTaskSchema
);
