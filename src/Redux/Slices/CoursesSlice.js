import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api"; // Import API instance

const API_URL = "course/courses/";

// 🔹 Fetch All Courses
export const fetchCourses = createAsyncThunk("courses/fetch", async (_, { rejectWithValue }) => {
    try {
        const response = await api.get(API_URL);
        console.log(response.data);
        
        return response.data;
        
    } catch (error) {
       
        return rejectWithValue(error.response?.data || "Something went wrong");
    }
});

export const addCourse = createAsyncThunk("courses/addCourse", async (formData, { rejectWithValue }) => {
    try {
        console.log("addCourse function called with:");
        formData.forEach((value, key) => {
        console.log(key, value);
       });

        const response = await api.post("course/courses/", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });


        return response.data;
    } catch (error) {
        console.error("Axios error:", error.response?.data || error.message);
        return rejectWithValue(error.response?.data || "Unknown error");
    }
});



// 🔹 Update Course
export const updateCourse = createAsyncThunk("courses/update", async ({ courseId, updatedData }, { rejectWithValue }) => {
    try {
        console.log(courseId);
        console.log(updatedData);
        
        
        const response = await api.put(`course/courses/${courseId}/`,updatedData, {
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
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // 📌 Add Course
            .addCase(addCourse.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses.push(action.payload);
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // 📌 Update Course
            .addCase(updateCourse.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                const index = state.courses.findIndex((course) => course.id === action.payload.id);
                if (index !== -1) state.courses[index] = action.payload;
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // 📌 Delete Course
            .addCase(deleteCourse.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.courses = state.courses.filter((course) => course.id !== action.payload);
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default courseSlice.reducer;
