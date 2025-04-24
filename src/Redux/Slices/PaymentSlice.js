import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from "../api"

// Async thunk to fetch payments
export const fetchPayments = createAsyncThunk('payments/fetchPayments', async () => {
    const response = await api.get('payment/payment-details/');
    return response.data;
});

// Redux slice
const paymentSlice = createSlice({
    name: 'payments',
    initialState: {
        payments: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPayments.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPayments.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.payments = action.payload;
            })
            .addCase(fetchPayments.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default paymentSlice.reducer;
