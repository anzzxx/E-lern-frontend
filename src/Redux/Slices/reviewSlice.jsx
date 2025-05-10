import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // Assume this is your API handler

// Async Thunk for fetching reviews
export const fetchReviews = createAsyncThunk(
  "reviews/fetchReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("reviews/retrive/"); // API request
      console.log(response.data,"review");
      
      return response.data; // Success - returns fetched data
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch reviews");
    }
  }
);



const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    isLoading: false,
    error: null,
  },
  reducers: {}, // No need for sync actions here

  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
