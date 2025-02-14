import Razorpay from "razorpay";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLANS = {
  INTERMEDIATE: {
    amount: 75000, // Amount in paise (₹750)
    currency: "INR",
    interval: "yearly",
    period: 365, // days
  },
  ADVANCED: {
    amount: 155000, // Amount in paise (₹1550)
    currency: "INR",
    interval: "yearly",
    period: 365, // days
  },
};

const createSubscription = asyncHandler(async (req, res) => {
  const { planType } = req.body;
  const userId = req.user._id;

  if (!planType || !PLANS[planType]) {
    throw new ApiError(400, "Invalid plan type");
  }

  const plan = PLANS[planType];

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id:
        planType === "INTERMEDIATE"
          ? process.env.RAZORPAY_INTERMEDIATE_PLAN_ID
          : process.env.RAZORPAY_ADVANCED_PLAN_ID,
      customer_notify: 1,
      total_count: 12, // 12 months for yearly subscription
      quantity: 1,
      notes: {
        userId: userId.toString(),
        planType,
      },
    });

    // Create subscription record in database
    await Subscription.create({
      userId,
      planType,
      razorpaySubscriptionId: subscription.id,
      status: "inactive",
    });

    return res.status(200).json({
      success: true,
      data: subscription,
      message: "Subscription created successfully",
    });
  } catch (error) {
    throw new ApiError(500, "Failed to create subscription");
  }
});

const verifySubscription = asyncHandler(async (req, res) => {
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    req.body;

  const subscription = await Subscription.findOne({
    razorpaySubscriptionId: razorpay_subscription_id,
  });

  if (!subscription) {
    throw new ApiError(404, "Subscription not found");
  }

  // Verify signature
  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_payment_id}|${razorpay_subscription_id}`)
    .digest("hex");

  if (generatedSignature !== razorpay_signature) {
    throw new ApiError(400, "Invalid signature");
  }

  // Update subscription status
  subscription.status = "active";
  subscription.razorpayPaymentId = razorpay_payment_id;
  subscription.startDate = new Date();
  subscription.endDate = new Date(
    Date.now() + PLANS[subscription.planType].period * 24 * 60 * 60 * 1000
  );
  await subscription.save();

  return res.status(200).json({
    success: true,
    data: subscription,
    message: "Subscription verified successfully",
  });
});

const getSubscriptionStatus = asyncHandler(async (req, res) => {
  const subscription = await Subscription.findOne({
    userId: req.user._id,
    status: "active",
  });

  return res.status(200).json({
    success: true,
    data: { subscription },
    message: "Subscription status retrieved",
  });
});

export { createSubscription, verifySubscription, getSubscriptionStatus };
