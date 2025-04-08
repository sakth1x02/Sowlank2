import { Schema, model } from "mongoose";

const pomodoroSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Type.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    taskName: {
      type: String,
      required: [true, "Task name is required"],
    },
  },
  { timestamps: true }
);

const Pomodoro = model("Pomodoro", pomodoroSchema);
