import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import api from '../api'



// Async action to fetch tests from the backend
export const fetchTests = createAsyncThunk("tests/fetchTests", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get("mcq/tests", {
           
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

// Slice
const testSlice = createSlice({
    name: "tests",
    initialState: {
        data: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTests.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTests.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchTests.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

// Export the reducer
export default testSlice.reducer;
