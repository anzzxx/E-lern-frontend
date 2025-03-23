import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./Features/auth/Login";
import TeachOnELERN from "./Features/instructers/TeachOnELERN";
import Signup from "./Features/auth/Signup";
import Profile from "./Features/auth/Profile";
import { ProtectedRoute, PublicRoute, SuperUserRoute } from "./components/ProtectedRoute";
import InstructorHome from "./pages/InstructorHome";
import Category from "./Features/instructers/Category";
import Course from "./Features/instructers/Course";
import OTPVerification from "./Features/auth/OTPVerification";
import CLogin from "./Features/cadmin/CLogin";
import Requests from "./Features/cadmin/Requests";
import AdminPanal from "./Features/cadmin/AdminPanal";
import Users from "./Features/cadmin/Users";
import ForgotPassword from "./Features/auth/ForgetPass";
import ResetPassword from './Features/auth/PasswordReset';
import Lessons from "./Features/instructers/Lessons";
import CourseDetail from "./pages/CourseDetail";
import Notification from './Features/notifications/Notification';
import Messages from "./pages/Messages";
import PaymentSuccess from './components/PaymentSucces'
import PaymentFailed from './components/PaymentFaild'
import Mycourses from './pages/Mycourses'
import SendNotification from "./Features/instructers/SendNotification";
import CourseWatch from "./pages/CourseWatch";
import CourseView   from "./Features/instructers/CourseView"
import McqTest from "./Features/instructers/McqTest";
import Mcq from "./pages/Mcq";
function App() {
  const token = useSelector((state) => state.auth.accessToken);  // ✅ Move useSelector here
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isStaff, setIsStaff] = useState(false);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAuthenticated(true);
        setIsStaff(decoded.is_staff);
        setIsSuperuser(decoded.is_superuser);
      } catch (error) {
        console.error("Invalid token:", error);
        setIsAuthenticated(false);
        setIsStaff(false);
        setIsSuperuser(false);
      }
    } else {
      setIsAuthenticated(false);
      setIsStaff(false);
      setIsSuperuser(false);
    }

    // Listen for storage changes (for example, logout from another tab)
    const handleStorageChange = () => {
      if (!localStorage.getItem("accessToken")) {
        setIsAuthenticated(false);
        setIsStaff(false);
        setIsSuperuser(false);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [token]);  // ✅ Depend on `token` instead of calling useSelector inside

  return (
    <Router>
      <Navbar isAuthenticated={isAuthenticated} isStaff={isStaff} isSuperuser={isSuperuser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />

        {/* 🚫 Prevent Authenticated Users from Accessing Login/Signup */}
        <Route element={<PublicRoute />}>
          <Route path="login/" element={<Login />} />
          <Route path="otp-validation/" element={<OTPVerification />} />
          <Route path="signup/" element={<Signup />} />
          <Route path="clogin/" element={<CLogin />} />
          <Route path="reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="forgot-password/" element={<ForgotPassword />} />
        </Route>

        <Route path="become-instructor/" element={<TeachOnELERN />} />

        {/* ✅ Protect Profile Route for Any Authenticated User */}
        <Route element={<ProtectedRoute />}>
          <Route path="profile/" element={<Profile />} />
          <Route path="messages/" element={<Messages />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/profile/my-courses" element={<Mycourses/>} />
          <Route path="/watch-course/:id" element={<CourseWatch />} />
          <Route path="mcq/test/:testID" element={<Mcq/>} />
        </Route>

        {/* Superuser-Only Routes */}
        <Route element={<SuperUserRoute />}>
          <Route path="/admin-panel" element={<AdminPanal />} />
          <Route path="/admin-panel/users" element={<Users />} />
          <Route path="/admin-panel/requests" element={<Requests />} />
        </Route>

        {/* 🔒 Protect Instructor Routes for Staff Only */}
        <Route element={<ProtectedRoute staffOnly={true} />}>
          <Route path="/instructor" element={<InstructorHome />} />
          <Route path="/instructor/category" element={<Category />} />
          <Route path="/instructor/course" element={<Course />} />
          <Route path="/instructor/lessons" element={<Lessons />} />
          <Route path="/instructor/notification" element={<SendNotification/>} />
          <Route path="/instructor/course/:id" element={<CourseView/>} />
          <Route path="/instructor/mcq-test" element={<McqTest/>} />
         
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
