import { configureStore } from "@reduxjs/toolkit";
import { uiReducerFun } from "./ui-slice";

const store = configureStore({
  reducer: {
    ui: uiReducerFun,
  },
});
export default store;
