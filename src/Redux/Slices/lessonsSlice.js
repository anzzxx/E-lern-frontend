import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
import { useSelector } from "react-redux";


// Fetch Lessons by Course ID
export const fetchLesson = createAsyncThunk("lesson/fetchLesson", async (courseId, thunkAPI) => {
    try {
        const response = await api.get(`lessons/get-lessons/?course_id=${courseId}`);
        return response.data; 
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



export const updateLesson = createAsyncThunk(
    "lesson/updateLesson",
    async ({ id, data }, { rejectWithValue }) => {
      try {
        const response = await api.patch(`lessons/edit-lessons/${id}/`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data || "An error occurred");
      }
    }
  );
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
