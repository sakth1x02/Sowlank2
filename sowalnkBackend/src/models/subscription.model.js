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
    razorpayOrderId: {
      type: String,
    },
    razorpayPaymentId: {
      type: String,
    },
    razorpaySubscriptionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ["created", "active", "inactive", "trail"],
      default: "inactive",
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    paymentAttempts: {
      type: Number,
      default: 0,
    },
    notes: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

// subscriptionSchema.methods.isInTrialPeriod = function () {
//   if (this.status === "trial" && this.startDate) {
//     const trialEnd = new Date(this.startDate);
//     trialEnd.setDate(trialEnd.getDate() + 10);
//     return new Date() < trialEnd;
//   }
//   return false;
// };

// userSchema.methods.getEffectivePlan = function() {
//   if (this.isInTrialPeriod()) {
//     return 'advanced'; // Give full access during trial
//   }
//   return this.subscriptionPlan;
// };
export const Subscription = mongoose.model("Subscription", subscriptionSchema);
