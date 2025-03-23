import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // Import API instance

const API_URL = "course/courses/";

// 🔹 Fetch All Courses
export const fetchCourses = createAsyncThunk("courses/fetch", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
      
        return response.data;
    } catch (error) {
      
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
});

// 🔹 Add Course
export const addCourse = createAsyncThunk("courses/add", async (formData, { rejectWithValue }) => {
    try {
        const response = await api.post(API_URL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to add course");
    }
});

// 🔹 Update Course
export const updateCourse = createAsyncThunk("courses/update", async ({ courseId, updatedData }, { rejectWithValue }) => {
    try {
        const response = await api.put(`${API_URL}${courseId}/`, updatedData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to update course");
    }
});

// 🔹 Delete Course
export const deleteCourse = createAsyncThunk("courses/delete", async (id, { rejectWithValue }) => {
    try {
        await api.delete(`${API_URL}${id}/`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data || "Failed to delete course");
    }
});

// 🔹 Course Slice
const courseSlice = createSlice({
    name: "courses",
    initialState: {
        courses: [],
        isLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 📌 Fetch Courses
            .addCase(fetchCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
               
                state.isLoading = false;
                state.courses = action.payload || [];
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // 📌 Add Course
            .addCase(addCourse.fulfilled, (state, action) => {
                state.courses.push(action.payload);
            })

            // 📌 Update Course
            .addCase(updateCourse.fulfilled, (state, action) => {
                const index = state.courses.findIndex((course) => course.id === action.payload.id);
                if (index !== -1) state.courses[index] = action.payload;
            })

            // 📌 Delete Course
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.courses = state.courses.filter((course) => course.id !== action.payload);
            });
    },
});

export default courseSlice.reducer;
