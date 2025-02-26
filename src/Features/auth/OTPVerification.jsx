import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { verifyOtp, resendOtp } from "../../Redux/Slices/otpmanageSlice";
import "../../styles/otpverification.css"; // Import CSS

const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigation
  const { verifying, resending, error, otpVerified, otpResent } = useSelector(
    (state) => state.otpManage
  );
  const user = useSelector((state) => state.signup.user?.user); // Ensure user exists

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  // useEffect for countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  // Start the timer when component mounts
  useEffect(() => {
    setTimer(30);
    setResendDisabled(true);
  }, []);

  // Redirect to login page upon successful OTP verification
  useEffect(() => {
    if (otpVerified) {
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 2000); // Delay for user feedback
    }
  }, [otpVerified, navigate]);

  // Handle OTP input change
  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only numbers, max 6 digits
    setOtp(value);
  };

  // Handle OTP verification
  const handleSubmit = () => {
    if (!user?.email) {
      alert("User email not found. Please sign up again.");
      return;
    }

    if (otp.length === 6) {
      dispatch(verifyOtp({ email: user.email, otp }));
    } else {
      alert("Please enter a 6-digit OTP.");
    }
  };

  // Handle OTP resend
  const handleResend = () => {
    if (!user?.email) {
      alert("User email not found. Please sign up again.");
      return;
    }

    dispatch(resendOtp(user.email)).then(() => {
      setOtp(""); // Clear input field
      setTimer(30); // Restart timer
      setResendDisabled(true);
    });
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Verify OTP</h2>
        <p>
          Enter the OTP sent to your email: <strong>{user?.email}</strong>
        </p>

        <input
          type="text"
          value={otp}
          onChange={handleChange}
          className="otp-input"
          placeholder="Enter OTP"
          maxLength="6"
          disabled={verifying}
        />

        <button onClick={handleSubmit} className="submit-btn" disabled={verifying}>
          {verifying ? "Verifying..." : "Submit"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {otpVerified && <p className="success-message">OTP Verified Successfully! Redirecting...</p>}

        <div className="resend-section">
          {resendDisabled ? (
            <p className="resend-timer">Resend OTP in {timer} sec</p>
          ) : (
            <button onClick={handleResend} className="resend-btn" disabled={resending}>
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </div>

        {otpResent && <p className="success-message">OTP Resent Successfully!</p>}
      </div>
    </div>
  );
};

export default OTPVerification;

