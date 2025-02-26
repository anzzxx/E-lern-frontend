import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./Features/auth/Login";
import TeachOnELERN from "./Features/instructers/TeachOnELERN";
import Signup from "./Features/auth/Signup";
import Profile from "./Features/auth/Profile";
import { ProtectedRoute, PublicRoute ,SuperUserRoute} from "./components/ProtectedRoute";
import InstructorHome from "./pages/InstructorHome";
import Category from "./Features/instructers/Category";
import Course from "./Features/instructers/Course";
import OTPVerification from "./Features/auth/OTPVerification";
import CLogin from "./Features/cadmin/CLogin";
import Requests from "./Features/cadmin/Requests";
import AdminPanal from "./Features/cadmin/AdminPanal";
import Users from "./Features/cadmin/Users";
import ForgotPassword from "./Features/auth/ForgetPass"
import ResetPassword from './Features/auth/PasswordReset'
function App() {
  const token = localStorage.getItem("accessToken");
  let isStaff = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isStaff = decoded.is_staff; 
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  return (
    <Router>
      {/* ✅ Show Navbar only if NOT staff */}
      {!isStaff && <Navbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />

    
        {/* 🚫 Prevent Authenticated Users from Accessing Login/Signup */}
      <Route element={<PublicRoute />}>
        <Route path="login/" element={<Login />} />
        <Route path="signup/otp-validation/" element={<OTPVerification />} />
        <Route path="signup/" element={<Signup />} />
        <Route path="clogin/" element={<CLogin />} />
        <Route path="reset-password/:uid/:token" element={<ResetPassword />} />
        <Route path="forgot-password/" element={<ForgotPassword />} />
      </Route>


        <Route path="become-instructor/" element={<TeachOnELERN />} />

        {/* ✅ Protect Profile Route for Any Authenticated User */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile/" element={<Profile />} />
        </Route>

        {/* Superuser-Only Routes */}
        <Route element={<SuperUserRoute />}>
          <Route path="/admin-panel" element={<AdminPanal/>} />
          <Route path="/admin-panel/users" element={<Users/>} />
          <Route path="/admin-panel/requests" element={<Requests/>} />
        </Route>

        {/* 🔒 Protect Instructor Routes for Staff Only */}
        <Route element={<ProtectedRoute staffOnly={true} />}>
          <Route path="/instructor" element={<InstructorHome />} />
          <Route path="/instructor/category" element={<Category />} />
          <Route path="/instructor/course" element={<Course />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
