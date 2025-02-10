import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await fetch("http://localhost:1000/api/v1/user/users", {
    credentials: "include",
  });
  const res = await response.json();
  return res.data;
});

export const updatePoints = createAsyncThunk(
  "user/updatePoints",
  async ({ userId, completed, taskId }) => {
    try {
      const response = await fetch(
        "http://localhost:1000/api/v1/user/update-points",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, completed, taskId }),
        }
      );

      if (response.ok) {
        const res = await response.json();
        return res.data;
      }
    } catch (error) {
      console.error("Error updating points:", error);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    taskPoint: [],
    loggedInUser: null,
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      })
      .addCase(updatePoints.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      });
  },
});

export const { setLoggedInUser } = userSlice.actions;
export default userSlice.reducer;
