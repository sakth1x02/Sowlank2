import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Helper to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async actions
export const fetchQuotes = createAsyncThunk("quote/fetchQuotes", async () => {
  const token = getAuthToken();
  const response = await fetch("/api/v1/quotes", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error("Failed to fetch quotes");
  return await response.json();
});

export const addQuote = createAsyncThunk("quote/addQuote", async (quote) => {
  const token = getAuthToken();
  const response = await fetch("/api/v1/quotes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(quote),
  });
  if (!response.ok) throw new Error("Failed to add quote");
  return await response.json();
});

export const toggleLikeQuote = createAsyncThunk(
  "quote/toggleLikeQuote",
  async (quoteId) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/quotes/like/${quoteId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to like quote");
    return await response.json();
  }
);

export const addComment = createAsyncThunk(
  "quote/addComment",
  async ({ quoteId, text }) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/quotes/comment/${quoteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text }),
    });
    if (!response.ok) throw new Error("Failed to add comment");
    return await response.json();
  }
);

export const toggleArchiveQuote = createAsyncThunk(
  "quote/toggleArchiveQuote",
  async (quoteId) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/quotes/archive/${quoteId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to toggle archive status");
    return await response.json();
  }
);

export const deleteQuote = createAsyncThunk(
  "quote/deleteQuote",
  async (quoteId) => {
    const token = getAuthToken();
    const response = await fetch(`/api/v1/quotes/${quoteId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error("Failed to delete quote");
    return quoteId; // Return the ID for filtering
  }
);

// Slice
const quoteSlice = createSlice({
  name: "quote",
  initialState: { quotes: [] },
  reducers: {
    // Add any synchronous reducers here if needed (e.g., local state updates)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuotes.fulfilled, (state, action) => {
        state.quotes = action.payload;
      })
      .addCase(addQuote.fulfilled, (state, action) => {
        state.quotes.push(action.payload);
      })
      .addCase(toggleLikeQuote.fulfilled, (state, action) => {
        const updatedQuote = action.payload;
        state.quotes = state.quotes.map((quote) =>
          quote._id === updatedQuote._id ? updatedQuote : quote
        );
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedQuote = action.payload;
        state.quotes = state.quotes.map((quote) =>
          quote._id === updatedQuote._id ? updatedQuote : quote
        );
      })
      .addCase(toggleArchiveQuote.fulfilled, (state, action) => {
        const updatedQuote = action.payload;
        state.quotes = state.quotes.map((quote) =>
          quote._id === updatedQuote._id ? updatedQuote : quote
        );
      })
      .addCase(deleteQuote.fulfilled, (state, action) => {
        state.quotes = state.quotes.filter(
          (quote) => quote._id !== action.payload
        );
      });
  },
});

// Export actions (none here since no reducers, but you can add if needed)
export const {} = quoteSlice.actions;

export default quoteSlice.reducer;