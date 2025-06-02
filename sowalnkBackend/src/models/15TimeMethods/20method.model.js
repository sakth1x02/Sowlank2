import mongoose from "mongoose";

const paretoTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    reminder: {
      type: Date,
      default: null,
    },
    alerted: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for better query performance
paretoTaskSchema.index({ user: 1, completed: 1 });
paretoTaskSchema.index({ user: 1, reminder: 1 });

const ParetoTask = mongoose.model("ParetoTask", paretoTaskSchema);

export default ParetoTask;
