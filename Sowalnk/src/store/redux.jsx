import { configureStore } from "@reduxjs/toolkit";
import { uiReducerFun } from "./ui-slice";
import taskReducerFun from "./task-slice";
const store = configureStore({
  reducer: {
    ui: uiReducerFun,
    task: taskReducerFun,
  },
});
export default store;
