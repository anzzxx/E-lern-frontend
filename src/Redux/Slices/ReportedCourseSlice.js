import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"

// Async thunk to fetch course reports
export const fetchCourseReports = createAsyncThunk(
  "courseReports/fetchCourseReports",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("course/reports/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Error fetching course reports");
    }
  }
);

const courseReportsSlice = createSlice({
  name: "courseReports",
  initialState: {
    reports: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCourseReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reports = action.payload;
      })
      .addCase(fetchCourseReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      
  },
});

export default courseReportsSlice.reducer;
