import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage for web

// Import all slices
import signupReducer from "./Slices/signupSlice";
import loginReducer from './Slices/loginSlice';
import InstructorReducer from './Slices/instructorcreationslice';
import authReducer from "./Slices/authSlice";
import profileReducer from "./Slices/EditProfileSlice";
import courseReducer from "../Redux/Slices/CoursesSlice";
import otpManageReducer from "../Redux/Slices/otpmanageSlice";
import cadminLoginReducer from "../Redux/Slices/cadminLoginSlice";
import lessonReducer from "../Redux/Slices/lessonsSlice"; 
import notificationReducer from "../Redux/Slices/notificationSlice";
import enrollmentReducer from "../Redux/Slices/enrollmentSlice";
import reviewSlice from "../Redux/Slices/reviewSlice";
import testReducer from "../Redux/Slices/TestSlice";
import questionReducer from "../Redux/Slices/QustionSlice";
import answerReducer from "../Redux/Slices/AnswerSlice";
import courseReportsSlice from "../Redux/Slices/ReportedCourseSlice";
import paymentSlice from "../Redux/Slices/PaymentSlice";
import instructorSlice from "../Redux/Slices/InstructorsSlice";
import instructorStatsReducer from '../Redux/Slices/instructorStatsSlice';
import instructorPayoutReducer from '../Redux/Slices/instructorPayoutSlice';
import studentProgressReducer from '../Redux/Slices/studentProgressSlice';
import instructorDashboardReducer from '../Redux/Slices/instructorDashboardSlice';
import courseRequestReducer from '../Redux/Slices/courseRequestSlice';
// Combine all reducers
const rootReducer = combineReducers({
  signup: signupReducer,
  login: loginReducer,
  Instructor: InstructorReducer,
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
  courseReports: courseReportsSlice,
  payments: paymentSlice,
  instructors: instructorSlice,
  instructorStats: instructorStatsReducer,
  instructorPayout: instructorPayoutReducer,
  studentProgress: studentProgressReducer,
  instructorDashboard: instructorDashboardReducer,
  courseRequests: courseRequestReducer,
});

// redux-persist config: persist only `auth` and `profile`
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'profile'], // only these slices will be persisted
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create Redux store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // to avoid redux-persist warnings
    }),
  devTools: true,
});

// Create persistor
export const persistor = persistStore(store);

export default store;
