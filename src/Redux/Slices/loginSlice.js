// src/redux/slices/loginSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: '',
  password: '',
  isLoading: false,
  error: null,
  accessToken: null,
  refreshToken: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setFormData(state, action) {
      const { name, value } = action.payload;
      state[name] = value;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setTokens(state, action) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setFormData, setLoading, setTokens, setError } = loginSlice.actions;

export default loginSlice.reducer;
