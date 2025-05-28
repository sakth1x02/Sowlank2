import mongoose from "mongoose";

const twoMinuteRuleSchema = new mongoose.Schema(
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
    minutes: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["do-now", "deferred"],
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    points: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TwoMinuteRule = mongoose.model("TwoMinuteRule", twoMinuteRuleSchema);

export default TwoMinuteRule;
