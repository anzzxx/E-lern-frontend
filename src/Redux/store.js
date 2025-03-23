import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./Slices/signupSlice";
import loginReducer from './Slices/loginSlice';
import InstructorReducer from './Slices/instructorcreationslice'
import authReducer from "./Slices/authSlice";
import profileReducer from "./Slices/EditProfileSlice"
import courseReducer from "../Redux/Slices/CoursesSlice"
import otpManageReducer from "../Redux/Slices/otpmanageSlice";
import cadminLoginReducer from "../Redux/Slices/cadminLoginSlice";
import lessonReducer from "../Redux/Slices/lessonsSlice"; 
import notificationReducer from "../Redux/Slices/notificationSlice";
import enrollmentReducer from "../Redux/Slices/enrollmentSlice";
import reviewSlice from "../Redux/Slices/reviewSlice";
import testReducer from "../Redux/Slices/TestSlice";
import questionReducer from "../Redux/Slices/QustionSlice";
import answerReducer from "../Redux/Slices/AnswerSlice";
const store = configureStore({
  reducer: {
    signup: signupReducer,
    login: loginReducer,
    Instructor:InstructorReducer,
    auth: authReducer,
    profile: profileReducer,
    courses: courseReducer,
    otpManage: otpManageReducer,
    cadminLogin: cadminLoginReducer,
    lesson: lessonReducer, 
    notifications: notificationReducer,
    enrollments: enrollmentReducer,
    reviews: reviewSlice,
    tests: testReducer,
    questions: questionReducer, 
    answers: answerReducer,
  },
  devTools: true, 
});

export default store;
