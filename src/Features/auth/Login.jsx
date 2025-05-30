import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, setLoading, setTokens, setError } from "../../Redux/Slices/loginSlice";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../Redux/Slices/authSlice";
import api from "../../Redux/api";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Navbar from "../../components/Navbar";
import "../../styles/Login.css";
const Login = () => {
  const dispatch = useDispatch();
  const { email, password, isLoading, error } = useSelector((state) => state.login);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    dispatch(setFormData({ name: e.target.name, value: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;

    dispatch(setLoading(true));

    try {
      const response = await api.post("api/login/", {
        email,
        password,
      });

      const { access, refresh } = response.data.tokens;

      const user = {
        id: response.data.id,
        username: response.data.username,
        email: response.data.email,
      };

      // ✅ Decode JWT to extract role
      const decoded = jwtDecode(access);
      const role = decoded.is_superuser
        ? "admin"
        : decoded.is_staff
        ? "staff"
        : "user";

      setSuccess("You're Logged IN Successfully");

      // ✅ Dispatch login with role
      dispatch(
        loginSuccess({
          user,
          accessToken: access,
          refreshToken: refresh,
          role,
        })
      );

      // ✅ Save to localStorage
      dispatch(setTokens({ accessToken: access, refreshToken: refresh }));
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      if (access) {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    } catch (error) {
      dispatch(setError(error.response?.data || "An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  // ✅ Auto-hide success or error messages after 2s
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess(null);
        dispatch(setError(null));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="login-container">
          <div className="form-box">
            <h2>Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-box">
                <label>Email</label>
                <input
                  type="email"
                  required
                  name="email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
              <div className="input-box">
                <label>Password</label>
                <input
                  type="password"
                  required
                  name="password"
                  value={password}
                  onChange={handleChange}
                />
              </div>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? <div className="spinner"></div> : <span>Submit</span>}
              </button>
            </form>
            <p className="login-link" onClick={() => navigate("/signup")}>
              Don't have an account? <a href>Sign Up</a>
            </p>
            <p className="login-link" onClick={() => navigate("/forgot-password/")}>
              Forget Password <a href>?</a>
            </p>
            {success && <p className="success-message">{success}</p>}
            {error && typeof error === "object" ? (
              <ul className="error-message">
                {Object.values(error).flat().map((msg, index) => (
                  <li key={index}>{msg}</li>
                ))}
              </ul>
            ) : (
              error && <p className="error-message">{error}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
