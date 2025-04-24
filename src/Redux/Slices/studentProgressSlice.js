import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

// Async thunk to fetch student progress data
export const fetchStudentProgress = createAsyncThunk(
  'studentProgress/fetchStudentProgress',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('course/students-progress/'); 
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const studentProgressSlice = createSlice({
  name: 'studentProgress',
  initialState: {
    progressData: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProgress.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentProgress.fulfilled, (state, action) => {
        state.loading = false;
        state.progressData = action.payload;
      })
      .addCase(fetchStudentProgress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default studentProgressSlice.reducer;
