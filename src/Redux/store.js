import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./Slices/signupSlice";
import loginReducer from './Slices/loginSlice';
import InstructorReducer from './Slices/instructorcreationslice'
import authReducer from "./Slices/authSlice";
import profileReducer from "./Slices/EditProfileSlice"
import courseReducer from "../Redux/Slices/CoursesSlice"
import otpManageReducer from "../Redux/Slices/otpmanageSlice";
import cadminLoginReducer from "../Redux/Slices/cadminLoginSlice";

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
     
  },
});

export default store;
