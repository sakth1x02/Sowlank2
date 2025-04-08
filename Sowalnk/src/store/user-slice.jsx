import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper function to get the token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async actions
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const token = getAuthToken();
  const response = await fetch(`/api/v1/user/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.error("Session expired. Please login again.");
    navigate("/login");
    return;
  }

  // Handle other non-OK responses
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const res = await response.json();
  return res.data;
});

export const updatePoints = createAsyncThunk(
  "user/updatePoints",
  async ({ userId, completed, taskId }, { rejectWithValue }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/update-points`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, completed, taskId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update points");
      }

      const res = await response.json();
      const data = await res?.data;
      return data;
    } catch (error) {
      console.error("Error updating points:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const increaseNormalCoins = createAsyncThunk(
  "user/increaseNormalCoins",
  async ({ userId, taskId }, { rejectWithValue }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/increase-normal-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, taskId }),
      });
      if (!response.ok) {
        throw new Error("Failed to increase normal coins");
      }
      const res = await response.json();
      if (!res.data) {
        throw new Error("No data received from server");
      }
      return res.data;
    } catch (error) {
      console.error("Error increasing normal coins:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const increaseGoldCoins = createAsyncThunk(
  "user/increaseGoldCoins",
  async ({ userId, taskId }, { rejectWithValue }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/increase-gold-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, taskId }),
      });
      if (!response.ok) {
        throw new Error("Failed to increase gold coins");
      }
      const res = await response.json();
      if (!res.data) {
        throw new Error("No data received from server");
      }
      return res.data;
    } catch (error) {
      console.error("Error increasing gold coins:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const increaseEliteCoins = createAsyncThunk(
  "user/increaseEliteCoins",
  async ({ userId, taskId }, { rejectWithValue }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/increase-elite-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, taskId }),
      });
      if (!response.ok) {
        throw new Error("Failed to increase elite coins");
      }
      const res = await response.json();
      if (!res.data) {
        throw new Error("No data received from server");
      }
      return res.data;
    } catch (error) {
      console.error("Error increasing elite coins:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const convertNormalCoinsToCoupon = createAsyncThunk(
  "user/convertNormalCoinsToCoupon",
  async ({ userId }, { rejectWithValue }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/convert-normal-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert normal coins");
      }
      const res = await response.json();
      if (!res.data) {
        throw new Error("No data received from server");
      }
      return res.data;
    } catch (error) {
      console.error("Error converting normal coins:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const convertGoldCoinsToCoupon = createAsyncThunk(
  "user/convertGoldCoinsToCoupon",
  async ({ userId }, { rejectWithValue }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/convert-gold-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to convert gold coins");
      }
      const res = await response.json();
      if (!res.data) {
        throw new Error("No data received from server");
      }
      return res.data;
    } catch (error) {
      console.error("Error converting gold coins:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const convertEliteCoinsToCoupon = createAsyncThunk(
  "user/convertEliteCoinsToCoupon",
  async ({ userId }, { rejectWithValue }) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`/api/v1/user/convert-elite-coins`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId }),
      });
      if (!response.ok) {
        throw new Error("Failed to convert elite coins");
      }
      const res = await response.json();
      if (!res.data) {
        throw new Error("No data received from server");
      }
      return res.data;
    } catch (error) {
      console.error("Error converting elite coins:", error);
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    taskPoint: [],
    loggedInUser: null,
    error: null,
  },
  reducers: {
    setLoggedInUser: (state, action) => {
      state.loggedInUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Points
      .addCase(updatePoints.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
          state.error = null;
        }
      })
      .addCase(updatePoints.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Increase Normal Coins
      .addCase(increaseNormalCoins.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
          state.error = null;
        }
      })
      .addCase(increaseNormalCoins.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Increase Gold Coins
      .addCase(increaseGoldCoins.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
          state.error = null;
        }
      })
      .addCase(increaseGoldCoins.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Increase Elite Coins
      .addCase(increaseEliteCoins.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
          state.error = null;
        }
      })
      .addCase(increaseEliteCoins.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Convert Normal Coins
      .addCase(convertNormalCoinsToCoupon.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
          state.error = null;
        }
      })
      .addCase(convertNormalCoinsToCoupon.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Convert Gold Coins
      .addCase(convertGoldCoinsToCoupon.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
          state.error = null;
        }
      })
      .addCase(convertGoldCoinsToCoupon.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Convert Elite Coins
      .addCase(convertEliteCoinsToCoupon.fulfilled, (state, action) => {
        if (action.payload) {
          state.users = state.users.map((user) =>
            user._id === action.payload._id ? action.payload : user
          );
          state.error = null;
        }
      })
      .addCase(convertEliteCoinsToCoupon.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setLoggedInUser } = userSlice.actions;

export default userSlice.reducer;
