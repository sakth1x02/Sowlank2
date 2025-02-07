import { configureStore } from "@reduxjs/toolkit";
import { uiReducerFun } from "./ui-slice";
import taskReducerFun from "./task-slice";
import weekltReducerFun from "./weekly-slice";
import monthlyReducerFun from "./monthly-slice";
import userReducerFun from "./user-slice.jsx";
const store = configureStore({
  reducer: {
    ui: uiReducerFun,
    task: taskReducerFun,
    weekly: weekltReducerFun,
    monthly: monthlyReducerFun,
    user: userReducerFun,
  },
});
export default store;
