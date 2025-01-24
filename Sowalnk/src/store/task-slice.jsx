import { createSlice } from "@reduxjs/toolkit";

const taskSlice = createSlice({
  name: "task",
  initialState: { dailyTask: [] },
  reducers: {
    setDailyTask(state, action) {
      const newTasks = Array.isArray(action.payload) ? action.payload : [];
      state.dailyTask = newTasks.filter(
        (task, index, self) =>
          self.findIndex((t) => t._id === task._id) === index
      );
    },
  },
});
export const { setDailyTask } = taskSlice.actions;
export const taskReducerFun = taskSlice.reducer;
