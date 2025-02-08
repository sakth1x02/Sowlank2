import React, { useEffect } from "react";
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
import { useSelector } from "react-redux";

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
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
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
              </Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;

// import React from 'react'
// import Dashboard1 from './Components/Dashboard1'
// import { BrowserRouter , Route, Routes } from 'react-router-dom'

// function App() {
//   return (
//     <div>
//       <BrowserRouter>
//       <Routes>
//       <Route path="/" element={<Dashboard1 />} />

//       </Routes>

//       </BrowserRouter>
//     </div>
//   )
// }

// export default App
