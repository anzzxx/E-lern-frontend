import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  user: null,
  accessToken: null,
  refreshToken: null,
  role: null, // 'admin', 'staff', or 'user'
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.role = action.payload.role; // Decoded and passed from the login handler
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.role = null;
    },
    updateRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { loginSuccess, logout, updateRole } = authSlice.actions;
export default authSlice.reducer;
