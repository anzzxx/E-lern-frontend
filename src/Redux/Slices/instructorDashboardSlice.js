
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api'; 


export const fetchInstructorAverageRating = createAsyncThunk(
  'instructorDashboard/fetchAverageRating',
  async () => {
    const response = await api.get('instructor/average-rating/');
    return response.data.avg_rating;
  }
);

export const fetchInstructorTotalEarnings = createAsyncThunk(
  'instructorDashboard/fetchTotalEarnings',
  async () => {
    const response = await api.get('instructor/totel-revenue/');
    return response.data.total_revenue;
  }
);

export const fetchInstructorStudents = createAsyncThunk(
  'instructorDashboard/fetchStudents',
  async () => {
    const response = await api.get('instructor/students/list');
    return response.data;  // returns the full list
  }
);

// Slice
const instructorDashboardSlice = createSlice({
  name: 'instructorDashboard',
  initialState: {
    avgRating: 0,
    totalEarnings: 0,
    studentsCount: 0,
    studentsList: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructorAverageRating.fulfilled, (state, action) => {
        state.avgRating = action.payload;
      })
      .addCase(fetchInstructorTotalEarnings.fulfilled, (state, action) => {
        state.totalEarnings = action.payload;
      })
      .addCase(fetchInstructorStudents.fulfilled, (state, action) => {
        state.studentsList = action.payload;
        state.studentsCount = action.payload.length;
      });
  },
});

export default instructorDashboardSlice.reducer;
