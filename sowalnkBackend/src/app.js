import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "sowalnk.com",
      "www.sowalnk.com",
      "application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
      "https://application-tier-ALB-52084640.ap-south-1.elb.amazonaws.com",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Credentials",
      "Access-Control-Allow-Origin",
    ],
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "16kbs" }));
app.use(express.static("public"));

//import Routes
import dailyTaskRouter from "./routers/daily.routes.js";
import userAuth from "./routers/user.routes.js";
import weeklyTaskRouter from "./routers/weekly.routes.js";
import monthlyTaskRouter from "./routers/monthly.routes.js";
import yearlyTaskRouter from "./routers/yearly.routes.js";
import subscriptionRouter from "./routers/subscription.routes.js";
//Route Declaration
app.use("/api/v1/task", dailyTaskRouter);
app.use("/api/v1/user", userAuth);
app.use("/api/v1/weeklytask", weeklyTaskRouter);
app.use("/api/v1/monthlytask", monthlyTaskRouter);
app.use("/api/v1/yearlytask", yearlyTaskRouter);
app.use("/api/v1/subscription", subscriptionRouter);

export { app };

// http://localhost:5173
