import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// Verify OTP with email
export const verifyOtp = createAsyncThunk(
  "otpManage/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    console.log(email,otp);
    
    try {
      const response = await api.post("api/verify-otp/", { email, otp }); // Sending email & OTP
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

// Resend OTP
export const resendOtp = createAsyncThunk(
  "otpManage/resendOtp",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("api/resend-otp/", { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "OTP resend failed");
    }
  }
);

const otpManageSlice = createSlice({
  name: "otpManage",
  initialState: {
    verifying: false,
    resending: false,
    error: null,
    otpVerified: false,
    otpResent: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // OTP Verification
      .addCase(verifyOtp.pending, (state) => {
        state.verifying = true;
        state.error = null;
        state.otpVerified = false;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.verifying = false;
        state.otpVerified = true;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      })

      // Resend OTP
      .addCase(resendOtp.pending, (state) => {
        state.resending = true;
        state.error = null;
        state.otpResent = false;
      })
      .addCase(resendOtp.fulfilled, (state) => {
        state.resending = false;
        state.otpResent = true;
      })
      .addCase(resendOtp.rejected, (state, action) => {
        state.resending = false;
        state.error = action.payload;
      });
  },
});

export default otpManageSlice.reducer;



