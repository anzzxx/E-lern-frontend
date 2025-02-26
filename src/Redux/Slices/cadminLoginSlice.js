import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"

export const loginUser = createAsyncThunk(
    "CadminLogin/loginUser",
    async ({ email, password }, { rejectWithValue }) => {
        
        try {
            const response = await api.post("cadmin/superuser-login/", {
                email,
                password,
            });
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);
            console.log(response.data);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.detail || "Login failed");
        }
    }
);

const cadminLoginSlice = createSlice({
    name: "CadminLogin",
    initialState: { user: null, loading: false, error: null },
    reducers: {
        logoutUser: (state) => {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logoutUser } = cadminLoginSlice.actions;
export default cadminLoginSlice.reducer;
