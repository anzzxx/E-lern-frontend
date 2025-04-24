import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; 

// Async thunk for fetching answers
export const fetchAnswers = createAsyncThunk(
  "answers/fetchAnswers",
  async (qustioId, { rejectWithValue }) => {
    try {
      const response = await api.get(`mcq/answers/${qustioId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch answers");
    }
  }
);



const answerSlice = createSlice({
  name: "answers",
  initialState: {
    data: [],
    status: "idle", // "idle" | "loading" | "succeeded" | "failed"
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnswers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAnswers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchAnswers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
  },
});

export default answerSlice.reducer;
