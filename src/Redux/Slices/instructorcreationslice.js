import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { handleLogout } from "../../components/Logout";
// Define the async thunk for registering an instructor
export const registerInstructor = createAsyncThunk(
  "instructor/registerInstructor",
  async (formData, { rejectWithValue, getState }) => {
    try {
      // Get the token from  localStorage 
      const token = localStorage.getItem("accessToken");
    
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post("http://127.0.0.1:8000/instructor/create-instructor/", formData, config);
      handleLogout()
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
