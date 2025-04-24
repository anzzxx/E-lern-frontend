import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// ✅ Fetch all instructors
export const fetchInstructors = createAsyncThunk(
  "instructors/fetchInstructors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("instructor/list-instructors/");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ✅ Fetch instructor by instructor ID
export const fetchInstructorById = createAsyncThunk(
  "instructors/fetchInstructorById",
  async (instructorId, { rejectWithValue }) => {
    try {
      const response = await api.get(`instructor/profile/retrieve/${instructorId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Fetch instructor by user ID 
export const fetchInstructorByUserId = createAsyncThunk(
  "instructors/fetchInstructorByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`instructor/user/${userId}/`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// ✅ Slice definition
const instructorSlice = createSlice({
  name: "instructors",
  initialState: {
    instructors: [],
    selectedInstructor: null,
    status: "idle",
    error: null,
  },
  reducers: {
    clearSelectedInstructor: (state) => {
      state.selectedInstructor = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔄 All instructors
      .addCase(fetchInstructors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.instructors = action.payload;
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // 🔄 Instructor by ID
      .addCase(fetchInstructorById.pending, (state) => {
        state.status = "loading";
        state.selectedInstructor = null;
      })
      .addCase(fetchInstructorById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedInstructor = action.payload;
      })
      .addCase(fetchInstructorById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // 🔄 Instructor by User ID (new)
      .addCase(fetchInstructorByUserId.pending, (state) => {
        state.status = "loading";
        state.selectedInstructor = null;
      })
      .addCase(fetchInstructorByUserId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedInstructor = action.payload;
      })
      .addCase(fetchInstructorByUserId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// ✅ Export actions & reducer
export const { clearSelectedInstructor } = instructorSlice.actions;
export default instructorSlice.reducer;
