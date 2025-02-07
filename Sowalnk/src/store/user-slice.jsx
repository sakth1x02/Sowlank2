import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await fetch("http://localhost:1000/api/v1/user/users");
  const res = await response.json();
  return res.data;
});

export const updatePoints = createAsyncThunk(
  "user/updatePoints",
  async (userId, completed) => {
    try {
      const response = await fetch(
        "http://localhost:1000/api/v1/user/update-points",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, completed }),
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
export default userSlice.reducer;
