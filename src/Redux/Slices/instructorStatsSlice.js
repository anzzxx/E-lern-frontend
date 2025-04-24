
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';


export const fetchInstructorStats = createAsyncThunk(
  'instructorStats/fetchInstructorStats',
  async (instructorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`payment/${instructorId}/monthly-stats/`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Something went wrong');
    }
  }
);

const instructorStatsSlice = createSlice({
  name: 'instructorStats',
  initialState: {
    stats: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructorStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorStats.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchInstructorStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default instructorStatsSlice.reducer;
