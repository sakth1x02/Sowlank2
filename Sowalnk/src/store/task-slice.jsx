import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { calculateProgress } from "../utils/calculateProgress";
// Async actions
export const fetchTasks = createAsyncThunk("task/fetchTasks", async () => {
  const response = await fetch("http://localhost:1000/api/v1/task/daily");
  return await response.json();
});

export const addTask = createAsyncThunk("task/addTask", async (task) => {
  const response = await fetch("http://localhost:1000/api/v1/task/daily", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return await response.json();
});

export const toggleTaskCompletion = createAsyncThunk(
  "task/toggleTaskCompletion",
  async (taskId) => {
    const response = await fetch(
      `http://localhost:1000/api/v1/task/daily/${taskId}/toggle`,
      { method: "PATCH" }
    );
    return await response.json();
  }
);

export const deleteTask = createAsyncThunk(
  "task/deleteTask",
  async (taskId) => {
    await fetch(`http://localhost:1000/api/v1/task/daily/${taskId}/delete`, {
      method: "DELETE",
    });
    return taskId;
  }
);

// Slice
const taskSlice = createSlice({
  name: "task",
  initialState: { dailyTask: [] },
  reducers: {
    calculateTaskProgress(state) {
      state.dailyTask = state.dailyTask.map((task) => {
        if (task.isCompleted) return task;
        const progress = calculateProgress(task.startTime, task.endTime);
        return { ...task, progress };
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.dailyTask = action.payload;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.dailyTask.push({ ...action.payload });
      })
      .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
        const updatedTask = action.payload;
        state.dailyTask = state.dailyTask.map((task) =>
          task._id === updatedTask._id ? updatedTask : task
        );
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.dailyTask = state.dailyTask.filter(
          (task) => task._id !== action.payload
        );
      });
  },
});
export const { calculateTaskProgress } = taskSlice.actions;
export default taskSlice.reducer;
