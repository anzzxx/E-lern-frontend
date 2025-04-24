import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../api'



// Async action to fetch tests from the backend
export const fetchTests = createAsyncThunk("tests/fetchTests", async (courseId, { rejectWithValue }) => {
    try {
        
        const response = await api.get(`mcq/tests/${courseId}/`, {
           
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

const testSlice = createSlice({
    name: 'tests',
    initialState: {
        data: [],
        status: 'idle',
        error: null
    },
    reducers: {
        // ... your other reducers
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTests.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchTests.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Always replace data with the response (which might be empty array)
                state.data = action.payload || [];
                state.error = null;
            })
            .addCase(fetchTests.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    }
});

// Export the reducer
export default testSlice.reducer;
