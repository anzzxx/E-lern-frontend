import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

// 🔹 Fetch Instructor Courses
export const fetchInstructorCourses = createAsyncThunk(
    "courses/fetchInstructor",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("course/courses/");
            console.log("inst course",response.data);
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

export const fetchCourse = createAsyncThunk(
    "course/fetchCourse",
    async ({ courseId, reportId }, { rejectWithValue }) => {
        try {
            const response = await api.get(`course/${courseId}/${reportId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);


// 🔹 Fetch All Courses
export const fetchAllCourses = createAsyncThunk(
    "courses/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/course/list/");
            return response.data.data; // Adjust according to your actual response
        } catch (error) {
            return rejectWithValue(error.response?.data || "Something went wrong");
        }
    }
);

// // 🔹 Add Course
// export const addCourse = createAsyncThunk(
//     "courses/add",
//     async (formData, { rejectWithValue }) => {
//         try {
//             const response = await api.post("course/create/", formData, {
//                 headers: { "Content-Type": "multipart/form-data" },
//             });
//             return response.data;
//         } catch (error) {
//             return rejectWithValue(error.response?.data || "Failed to add course");
//         }
//     }
// );


// 🔹 Add Course with progress tracking
export const addCourse = createAsyncThunk(
  "courses/add",
  async ({ formData, setProgress }, { rejectWithValue }) => {
    try {
      const response = await api.post("course/create/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total && setProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add course");
    }
  }
);

// 🔹 Update Course
export const updateCourse = createAsyncThunk(
    "courses/update",
    async ({ courseId, updatedData }, { rejectWithValue }) => {
        try {
            const response = await api.put(`course/courses/${courseId}/`, updatedData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to update course");
        }
    }
);

// 🔹 Delete Course
export const deleteCourse = createAsyncThunk(
    "courses/delete",
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`course/courses/${id}/`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to delete course");
        }
    }
);

// 🔸 Initial State
const initialState = {
    instructorCourses: [],
    allCourses: [],
    singleCourse: null,
    isLoading: false,
    error: null,
};

// 🔸 Slice
const courseSlice = createSlice({
    name: "courses",
    initialState,
    reducers: {
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // 📌 Fetch Instructor Courses
            .addCase(fetchInstructorCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchInstructorCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.instructorCourses = action.payload || [];
            })
            .addCase(fetchInstructorCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // 📌 Fetch All Courses
            .addCase(fetchAllCourses.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchAllCourses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.allCourses = action.payload || [];
            })
            .addCase(fetchAllCourses.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // 📌 Fetch Single Course
            .addCase(fetchCourse.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(fetchCourse.fulfilled, (state, action) => {
                state.isLoading = false;
                state.singleCourse = action.payload?.data || action.payload;
            })
            .addCase(fetchCourse.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // 📌 Add Course
            .addCase(addCourse.fulfilled, (state, action) => {
                state.instructorCourses.push(action.payload);
                state.allCourses.push(action.payload);
            })
            .addCase(addCourse.rejected, (state, action) => {
                state.error = action.payload;
            })

            // 📌 Update Course
            .addCase(updateCourse.fulfilled, (state, action) => {
                const updateInList = (list) => {
                    const index = list.findIndex(course => course.id === action.payload.id);
                    if (index !== -1) list[index] = action.payload;
                };
                updateInList(state.instructorCourses);
                updateInList(state.allCourses);
                if (state.singleCourse?.id === action.payload.id) {
                    state.singleCourse = action.payload;
                }
            })
            .addCase(updateCourse.rejected, (state, action) => {
                state.error = action.payload;
            })

            // 📌 Delete Course
            .addCase(deleteCourse.fulfilled, (state, action) => {
                const filterOut = (list) => list.filter(course => course.id !== action.payload);
                state.instructorCourses = filterOut(state.instructorCourses);
                state.allCourses = filterOut(state.allCourses);
                if (state.singleCourse?.id === action.payload) {
                    state.singleCourse = null;
                }
            })
            .addCase(deleteCourse.rejected, (state, action) => {
                state.error = action.payload;
            });
    },
});

export const { clearErrors } = courseSlice.actions;
export default courseSlice.reducer;
