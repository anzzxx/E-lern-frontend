import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
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
import CourseDetail from "./pages/CourseDetail";
import Messages from "./pages/Messages";
import PaymentSuccess from './components/PaymentSucces';
import PaymentFailed from './components/PaymentFaild';
import Mycourses from './pages/Mycourses';
import SendNotification from "./Features/instructers/SendNotification";
import CourseWatch from "./pages/CourseWatch";
import Mcq from "./pages/Mcq";
import ReportedCourse from "./Features/cadmin/ReportedCourse";
import Payments from "./Features/cadmin/Payments";
import Instructors from "./Features/cadmin/Instructors";
import InstructorPayments from "./Features/cadmin/InstructorPayments";
import Revenue from "./Features/instructers/Revenue";
import Test from "./components/Test";
import CourseDetailView from "./Features/instructers/CourseDetailView";
import InstructorPaymentDashboard from "./Features/instructers/InstructorPaymentDashboard";
import QuizManagement from "./Features/mcqtest/QuizManagement";
import SearchPage from "./components/SearchPage";
import JoinRoom from "./Features/Metting/JoinRoom";
import VideoCall from "./Features/Metting/VideoChatRoom ";
import Certificate from "./components/Certificate";
import NotFoundPage from "./components/NotFoundPage";
import CreateMeetingButton from "./Features/instructers/CreateMeetingButton";

// import Room from "./Features/Metting/Room";
//   Join from "./Features/Metting/Join";
// import Studentjoin from "./Features/Metting/Studentjoin";
// import JoinScreen from "./Features/Metting/JoinScreen";
// import VideoChat from "./Features/Metting/VideoChat";
function App() {
  const { allCourses } = useSelector((state) => state.courses);
  // const token = useSelector((state) => state.auth.accessToken);
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [isStaff, setIsStaff] = useState(false);
  // const [isSuperuser, setIsSuperuser] = useState(false);

  // const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   const isRefreshed = sessionStorage.getItem("hasRefreshed");

  //   if (!isRefreshed) {
  //     sessionStorage.setItem("hasRefreshed", "true");

  //     if (location.pathname !== "/") {
  //       navigate("/", { replace: true });
  //     }
  //   }
  // }, [location.pathname, navigate]);

  

  // useEffect(() => {
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       setIsAuthenticated(true);
  //       setIsStaff(decoded.is_staff);
  //       setIsSuperuser(decoded.is_superuser);
  //     } catch (error) {
  //       console.error("Invalid token:", error);
  //       setIsAuthenticated(false);
  //       setIsStaff(false);
  //       setIsSuperuser(false);
  //     }
  //   } else {
  //     setIsAuthenticated(false);
  //     setIsStaff(false);
  //     setIsSuperuser(false);
  //   }

  //   const handleStorageChange = () => {
  //     if (!localStorage.getItem("accessToken")) {
  //       setIsAuthenticated(false);
  //       setIsStaff(false);
  //       setIsSuperuser(false);
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  // }, [token]);

  return (
    <>
      {/* <Navbar  /> */}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/search" element={<SearchPage allCourses={allCourses} />} />
        <Route path="*" element={<NotFoundPage/>} />
        <Route element={<PublicRoute />}>
          <Route path="login/" element={<Login />} />
          <Route path="otp-validation/" element={<OTPVerification />} />
          <Route path="signup/" element={<Signup />} />
          <Route path="clogin/" element={<CLogin />} />
          <Route path="reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="forgot-password/" element={<ForgotPassword />} />
          
        </Route>

        

        <Route element={<ProtectedRoute />}>
          <Route path="become-instructor/" element={<TeachOnELERN />} />
          <Route path="profile/" element={<Profile />} />
          <Route path="messages/" element={<Messages />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failed" element={<PaymentFailed />} />
          <Route path="/profile/my-courses" element={<Mycourses />} />
          <Route path="/watch-course/:id" element={<CourseWatch />} />
          <Route path="mcq/test/:testID/:courseId/" element={<Mcq />} />
          <Route path="profile/certificate" element={<Certificate/>} />
 
          <Route path="/room" element={<JoinRoom />} />
          <Route path="/room/join/:roomName/" element={<VideoCall/>} />
          {/* <Route path="/join/meeting/:roomName/" element={<Room />} />
          <Route path="/profile/join-meeting" element={<Studentjoin/>}/>  */}

      
        </Route>

        <Route element={<SuperUserRoute />}>
          <Route path="/admin-panel" element={<AdminPanal />} />
          <Route path="/admin-panel/users" element={<Users />} />
          <Route path="/admin-panel/requests" element={<Requests />} />
          <Route path="/admin-panel/reportedcourse-list" element={<ReportedCourse />} />
          <Route path="/admin-panel/payments" element={<Payments />} />
          <Route path="/admin-panel/instructors" element={<Instructors />} />
          <Route path="/admin-panel/instructors/details/:instructorId/" element={<InstructorPayments />} />
        </Route>

        <Route element={<ProtectedRoute staffOnly={true} />}>
          <Route path="/instructor" element={<InstructorHome />} />
          <Route path="/instructor/category" element={<Category />} />
          <Route path="/instructor/course" element={<Course />} />
          <Route path="/instructor/notification" element={<SendNotification />} />
          <Route path="/instructor/course/:id" element={<CourseDetailView />} />
          <Route path="/instructor/course/create-test/:id" element={<Test />} />
          <Route path="/instructor/course/manage-test/:testId/:courseId/" element={<QuizManagement />} />
          <Route path="/instructor/revenue" element={<Revenue />} />
          <Route path="/instructor/payment/details" element={<InstructorPaymentDashboard/>} />
          <Route path="/instructor/create-meenting" element={<CreateMeetingButton/>}/>
          
        </Route>
      </Routes>
    </>
  );
}

export default App;
