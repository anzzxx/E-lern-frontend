import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyOtp, resendOtp } from "../../Redux/Slices/otpmanageSlice";
import "../../styles/Login.css"; // Using the common login styles

const OTPVerification = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { verifying, resending, error, otpVerified, otpResent } = useSelector(
    (state) => state.otpManage
  );
  const user = useSelector((state) => state.signup.user?.user);

  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setResendDisabled(false);
    }
  }, [timer]);

  useEffect(() => {
    setTimer(30);
    setResendDisabled(true);
  }, []);

  useEffect(() => {
    if (otpVerified) {
      setTimeout(() => navigate("/login"), 2000);
    }
  }, [otpVerified, navigate]);

  const handleChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(value);
  };

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

  const handleResend = () => {
    if (!user?.email) {
      alert("User email not found. Please sign up again.");
      return;
    }

    dispatch(resendOtp(user.email)).then(() => {
      setOtp("");
      setTimer(30);
      setResendDisabled(true);
    });
  };

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="form-box">
          <h2>Verify OTP</h2>
          <p className="info-text">
            Enter the OTP sent to <strong>{user?.email}</strong>
          </p>

          <div className="input-box">
          <label>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={handleChange}
              maxLength="6"
              required
              disabled={verifying}
            />
            
          </div>

          <button onClick={handleSubmit} className="submit-btn" disabled={verifying}>
            {verifying ? <div className="spinner"></div> : "Verify OTP"}
          </button>

          {error && <p className="error-message">{error}</p>}
          {otpVerified && <p className="success-message">OTP Verified! Redirecting...</p>}

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
    </div>
  );
};

export default OTPVerification;


