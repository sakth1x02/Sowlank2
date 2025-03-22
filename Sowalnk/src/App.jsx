import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import About from "./Components/About";
import Feature from "./Components/Feature";
import Subscription from "./Components/Subscription";
import Signup from "./Components/Signup";
import Layout from "./Components/Layout";
import Login from "./Components/Login";
import Dashboard1 from "./Components/Dashboard1";
import DailyTask from "./Components/DailyTask";
import WeeklyTask from "./Components/WeeklyTask";
import MonthlyTask from "./Components/MonthlyTask";
import TaskChart from "./Components/TaskChart";
import Ranking from "./Components/Ranking.jsx";
import CompletedTask from "./Components/CompletedTask";
import Coupons from "./Components/Coupons/Coupons.jsx";
import { useSelector, useDispatch } from "react-redux";
import NormalCoinConvert from "./Components/Coupons/NormalCoinConvert.jsx";
import GoldCoinConvert from "./Components/Coupons/GoldCoinConvert.jsx";
import EliteCoinConvert from "./Components/Coupons/EliteCoinConvert.jsx";
import YearlyTask from "./Components/YearlyTask";
import OverdueTask from "./Components/OverdueTask.jsx";
import Reminders from "./Components/Reminders.jsx";
import VerifyEmailPage from "./Components/VerifyEmailPage.jsx";
import ForgetPasswordPage from "./Components/ForgetPasswordPage.jsx";
import ResetPasswordPage from "./ResetPasswordPage.jsx";
import ContactUs from "./Components/ContactUs.jsx";
import Settings from "./Components/Settings.jsx";
import NotFound from "./Components/NotFound.jsx";
import Feedback from "./Components/Feedback.jsx";
import { toast } from "react-toastify";
import { Loader } from "lucide-react";
import { fetchUsers } from "./store/user-slice";
import TimeManage from "./Components/TimeManagement/TimeManage.jsx";
const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const auth = useSelector((state) => state.user.loggedInUser);

  useEffect(() => {
    if (auth) {
      dispatch(fetchUsers());
    }
  }, [auth, dispatch]);

  const userFeedback = users.find((user) => user._id === auth._id);
  useEffect(() => {
    if (userFeedback !== undefined) {
      const timer = setTimeout(() => {
        if (!userFeedback?.isFeedback) {
          setShowPopup(true);
        }
      }, 10000); // 10 seconds

      return () => clearTimeout(timer);
    }
  }, [userFeedback, dispatch]);

  const handleSubmitFeedback = async (feedbackdata) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/v1/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackdata),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error);
      }
      setShowPopup(false); // Close the popup after successful submission
    } catch (error) {
      toast.error("Failed to send feedback.");
      console.error("Error:", error);
    }
  };

  // if (isLoading && auth) {
  //   return (
  //     <Loader className="w-10 h-10 text-purple-700 animate-spin mx-auto" />
  //   );
  // }

  return (
    <>
      <BrowserRouter>
        <div className="flex">
          <div className="flex-grow">
            {/* Your existing content */}
            {showPopup && (
              <Feedback
                onClose={() => setShowPopup(false)}
                onSubmit={handleSubmitFeedback}
              />
            )}
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="about" element={<About />} />
                <Route path="features" element={<Feature />} />
                <Route
                  path="pricing"
                  element={auth ? <Subscription /> : <Login />}
                />
                <Route path="contact" element={<ContactUs />} />
                <Route
                  path="login"
                  element={auth ? <LandingPage /> : <Login />}
                />
                <Route
                  path="signup"
                  element={auth ? <LandingPage /> : <Signup />}
                />
                <Route
                  path="verify-email"
                  element={auth ? <LandingPage /> : <VerifyEmailPage />}
                />
                <Route
                  path="forget-password"
                  element={auth ? <LandingPage /> : <ForgetPasswordPage />}
                />
                <Route
                  path="/reset-password/:token"
                  element={auth ? <LandingPage /> : <ResetPasswordPage />}
                />

                <Route
                  path="dashboard"
                  element={auth ? <Dashboard1 /> : <Login />}
                />
                <Route
                  path="dailytask"
                  element={auth ? <DailyTask /> : <Login />}
                />
                <Route
                  path="weekly"
                  element={auth ? <WeeklyTask /> : <Login />}
                />
                <Route
                  path="monthly"
                  element={auth ? <MonthlyTask /> : <Login />}
                />
                <Route
                  path="yearly"
                  element={auth ? <YearlyTask /> : <Login />}
                />
                <Route
                  path="time-management"
                  element={auth ? <TimeManage /> : <Login />}
                />
                <Route
                  path="taskchart"
                  element={auth ? <TaskChart /> : <Login />}
                />
                <Route
                  path="rankings"
                  element={auth ? <Ranking /> : <Login />}
                />
                <Route
                  path="completed-task"
                  element={auth ? <CompletedTask /> : <Login />}
                />
                <Route
                  path="overdue-task"
                  element={auth ? <OverdueTask /> : <Login />}
                />
                <Route
                  path="coupons"
                  element={auth ? <Coupons /> : <Login />}
                />
                <Route
                  path="reminders"
                  element={auth ? <Reminders /> : <Login />}
                />

                <Route
                  path="coupons/normal"
                  element={auth ? <NormalCoinConvert /> : <Login />}
                />
                <Route
                  path="coupons/gold"
                  element={auth ? <GoldCoinConvert /> : <Login />}
                />
                <Route
                  path="coupons/elite"
                  element={auth ? <EliteCoinConvert /> : <Login />}
                />
                <Route
                  path="settings"
                  element={auth ? <Settings /> : <Login />}
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
