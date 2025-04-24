import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Async thunk to fetch user's enrolled courses
export const fetchEnrolledCourses = createAsyncThunk(
  "enrollments/fetchEnrolledCourses",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("course/enrollments/");

      // Expected response structure:
      // {
      //   success: true,
      //   count: 2,
      //   courses: [...]
      // }

      return {
        courses: response.data.courses,
        total: response.data.count,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch enrolled courses");
    }
  }
);

const initialState = {
  courses: [],
  stats: {
    total: 0,
    completed: 0,
    in_progress: 0,
    completion_rate: "0%",
  },
  loading: false,
  error: null,
  lastFetched: null,
};

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    clearEnrollments: (state) => {
      state.courses = [];
      state.stats = {
        total: 0,
        completed: 0,
        in_progress: 0,
        completion_rate: "0%",
      };
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrolledCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrolledCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.courses;

        const completed = action.payload.courses.filter((c) => c.progress === 100).length;
        const total = action.payload.total;
        const inProgress = total - completed;

        state.stats = {
          total,
          completed,
          in_progress: inProgress,
          completion_rate: total > 0 ? `${Math.round((completed / total) * 100)}%` : "0%",
        };

        state.lastFetched = new Date().toISOString();
      })
      .addCase(fetchEnrolledCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEnrollments } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
