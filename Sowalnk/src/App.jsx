import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useSelector } from "react-redux";
import NormalCoinConvert from "./Components/Coupons/NormalCoinConvert.jsx";
import GoldCoinConvert from "./Components/Coupons/GoldCoinConvert.jsx";
import EliteCoinConvert from "./Components/Coupons/EliteCoinConvert.jsx";
import YearlyTask from "./Components/YearlyTask";
const App = () => {
  const auth = useSelector((state) => state.user.loggedInUser);
  return (
    <>
      <BrowserRouter>
        <div className="flex">
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<LandingPage />} />
                <Route path="about" element={<About />} />
                <Route path="features" element={<Feature />} />
                <Route path="pricing" element={<Subscription />} />
                <Route
                  path="login"
                  element={auth ? <LandingPage /> : <Login />}
                />
                <Route
                  path="signup"
                  element={auth ? <LandingPage /> : <Signup />}
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
                  path="coupons"
                  element={auth ? <Coupons /> : <Login />}
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
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
