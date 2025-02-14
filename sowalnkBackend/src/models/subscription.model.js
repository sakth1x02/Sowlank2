import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    planType: {
      type: String,
      enum: ["BASIC", "INTERMEDIATE", "ADVANCED"],
      required: true,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySubscriptionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "cancelled"],
      default: "inactive",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
