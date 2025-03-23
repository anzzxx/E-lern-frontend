import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { useSelector } from "react-redux";


// Fetch Lessons
export const fetchLesson = createAsyncThunk("lesson/fetchLesson", async (_, thunkAPI) => {
    try {
        console.log("Fetching lessons...");
        const response = await api.get("lessons/get-lessons/", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        console.log(response.data);
        return response.data; // Expecting an array
    } catch (error) {
        console.error("Error fetching lessons:", error);
        return thunkAPI.rejectWithValue(error.response?.data || "An error occurred");
    }
});

// 🔹 Create Lesson
export const createLesson = createAsyncThunk("lesson/createLesson", async (formData, { rejectWithValue }) => {
    try {
        for (let [key, value] of formData.entries()) {
            console.log(`FormData -> ${key}:`, value);
        }

        const response = await api.post("lessons/get-lessons/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred while creating the lesson");
    }
});

// Update Lesson
export const updateLesson = createAsyncThunk("lesson/updateLesson", async ({ lessonId, lessonData }, { rejectWithValue }) => {
    try {
        const formData = new FormData();
        formData.append("title", lessonData.title);
        formData.append("description", lessonData.description);
        if (lessonData.video_file) {
            formData.append("video_file", lessonData.video_file);
        }

        const response = await api.put(`lessons/edit-lessons/${lessonId}/`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
    }
});

// ✅ Make sure `lessonSlice` is defined before exporting
const lessonSlice = createSlice({
    name: "lesson",
    initialState: {
        lessons: [],
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        resetSuccess: (state) => {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLesson.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = action.payload;
            })
            .addCase(fetchLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateLesson.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(updateLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons = state.lessons.map((lesson) =>
                    lesson.id === action.payload.id ? action.payload : lesson
                );
                state.success = true;
            })
            .addCase(updateLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createLesson.pending, (state) => {
                state.loading = true;
                state.success = false;
            })
            .addCase(createLesson.fulfilled, (state, action) => {
                state.loading = false;
                state.lessons.push(action.payload); // Add new lesson to the list
                state.success = true;
            })
            .addCase(createLesson.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// ✅ Fix the export issue
export const { resetSuccess } = lessonSlice.actions;
export default lessonSlice.reducer;
