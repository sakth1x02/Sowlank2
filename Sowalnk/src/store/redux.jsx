import { configureStore } from "@reduxjs/toolkit";
import { uiReducerFun } from "./ui-slice";
import taskReducerFun from "./task-slice";
import weekltReducerFun from "./weekly-slice";
const store = configureStore({
  reducer: {
    ui: uiReducerFun,
    task: taskReducerFun,
    weekly: weekltReducerFun,
  },
});
export default store;
