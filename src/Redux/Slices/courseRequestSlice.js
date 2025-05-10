
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api";

// Async thunk to fetch inactive course requests
export const fetchInactiveCourseRequests = createAsyncThunk(
  'courseRequests/fetchInactive',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('cadmin/inactive-courses/');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch');
    }
  }
);

const courseRequestSlice = createSlice({
  name: 'courseRequests',
  initialState: {
    requests: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearCourseRequests: (state) => {
      state.requests = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInactiveCourseRequests.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInactiveCourseRequests.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.requests = action.payload;
      })
      .addCase(fetchInactiveCourseRequests.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearCourseRequests } = courseRequestSlice.actions;
export default courseRequestSlice.reducer;
