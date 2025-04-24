
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';


export const fetchInstructorPayout = createAsyncThunk(
  'instructorPayout/fetchInstructorPayout',
  async (instructorId, thunkAPI) => {
    try {
      const response = await api.get(`payment/payout-summary/${instructorId}/`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Failed to fetch payout summary');
    }
  }
);

const instructorPayoutSlice = createSlice({
  name: 'instructorPayout',
  initialState: {
    loading: false,
    error: null,
    payoutSummary: {
      month: '',
      total_amount: 0,
      instructor_share: 0,
      platform_share: 0,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructorPayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorPayout.fulfilled, (state, action) => {
        state.loading = false;
        state.payoutSummary = action.payload;
      })
      .addCase(fetchInstructorPayout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default instructorPayoutSlice.reducer;
