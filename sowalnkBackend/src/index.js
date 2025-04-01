import dotenv from "dotenv";
import express from "express";
import connectDB from "./db/index.js";
import { app, server } from "./app.js"; // Assuming `app.js` properly exports `app`
import { sendEmail, sendEmailFeedback } from "./mailtrap/emails.js";
import { verifyJWT } from "./middleware/auth.middleware.js";
import { User } from "./models/user.model.js";
import { Subscription } from "./models/subscription.model.js";
import cron from "node-cron";

dotenv.config({ path: "./.env" });

app.use(express.json()); // Middleware to parse JSON body

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.post("/api/v1/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }
  try {
    await sendEmail(email, name, message);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Failed to send email" });
  }
});

app.post("/api/v1/send-feedback", verifyJWT, async (req, res) => {
  const { rating, feedback } = req.body;
  const { email, name } = req.user;
  if (!rating) {
    return res.status(400).json({ error: "rating is required" });
  }
  try {
    await sendEmailFeedback(rating, feedback, email, name);
    const user = await User.findOne({ email });
    user.isFeedback = true;
    await user.save();
    res.status(200).json({ message: "Thank you for your feedback!" });
  } catch (error) {
    console.error("Error sending feedback:", error);
    res.status(500).json({ error: "Failed to send feedback" });
  }
});

//For checking the token expired or not
app.get("/api/v1/check-auth", verifyJWT, async (req, res) => {
  res.status(200).json({ message: "Valid Token" });
});

cron.schedule("0 0 * * *", async () => {
  try {
    console.log("Running subscription cleanup job...");
    const currentDate = new Date();
    const result = await Subscription.updateMany(
      {
        status: { $in: ["trial", "active"] },
        endDate: { $lt: currentDate },
      },
      {
        $set: { status: "inactive" },
      }
    );

    console.log(
      `Updated ${result.modifiedCount} expired subscriptions to inactive`
    );
  } catch (error) {
    console.error("Error in subscription cron job:", error);
  }
});

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 2000, () => {
      console.log(`Listening on port ${process.env.PORT || 2000}`);
    });
  })
  .catch((err) => {
    console.error("Error in database connection", err);
    process.exit(1);
  });
