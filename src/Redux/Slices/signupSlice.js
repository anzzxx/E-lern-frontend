import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../Redux/api";

// Async thunk to handle API request
export const registerUser = createAsyncThunk(
  "signup/registerUser",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await api.post("api/register/", formData);
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.non_field_errors ||
        error.response?.data?.detail ||
        error.response?.data ||
        "Registration failed"
      );
    }
  }
);

const signupSlice = createSlice({
  name: "signup",
  initialState: {
    user: JSON.parse(localStorage.getItem("user")) || null, // Load user from local storage
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("user"); // Clear user data on logout
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem("user", JSON.stringify(action.payload)); // Store user in local storage
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = signupSlice.actions;
export default signupSlice.reducer;
