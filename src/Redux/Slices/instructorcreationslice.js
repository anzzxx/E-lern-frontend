import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Define the async thunk for registering an instructor

export const registerInstructor = createAsyncThunk(
  "instructor/registerInstructor",
  async (formData, { rejectWithValue, getState }) => {
    try {
      
      const response = await api.post("instructor/create-instructor/", formData);
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : error.message);
    }
  }
);

const instructorSlice = createSlice({
  name: "instructor",
  initialState: {
    instructor: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructor = action.payload;
      })
      .addCase(registerInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default instructorSlice.reducer;
