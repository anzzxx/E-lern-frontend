import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../api'

// Async thunk to fetch enrollments
export const fetchEnrollments = createAsyncThunk(
  "enrollments/fetchEnrollments",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("course/enrollments");
      
      // Process data: Extract required fields
      const formattedData = response.data.slice(0, 10).map((item) => ({
        id: item.id,
        user: {
          id: item.user.id,
          username: item.user.username,
          email: item.user.email,
        },
        course: {
          id: item.course.id,
          title: item.course.title,
          price: item.course.price,
          thumbnail: item.course.thumbnail,
          preview_video: item.course.preview_video,
          is_active: item.course.is_active,
        },
        payment: item.payment,
        status: item.status,
        progress: item.progress,
        enrolled_at: item.enrolled_at,
      }));

      return formattedData;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const enrollmentSlice = createSlice({
  name: "enrollments",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default enrollmentSlice.reducer;
