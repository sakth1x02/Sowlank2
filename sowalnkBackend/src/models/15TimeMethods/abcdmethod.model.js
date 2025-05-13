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

export const ABCDETask = mongoose.model("ABCDETask", abcdeTaskSchema);
