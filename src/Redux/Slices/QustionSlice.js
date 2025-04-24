import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from'../api'


// Async action to fetch questions
export const fetchQuestions = createAsyncThunk(
    "questions/fetchQuestions",
    async (testId, { rejectWithValue }) => {
        try {
            const response = await api.get(`mcq/questions/${testId}`, {
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "An error occurred");
        }
    }
);

// Slice
const questionSlice = createSlice({
    name: "questions",
    initialState: {
        data: [],
        status: "idle", // idle | loading | succeeded | failed
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.data = action.payload;
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

// Export the reducer
export default questionSlice.reducer;
