import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFormData, setLoading, setTokens, setError } from "../../Redux/Slices/loginSlice";
import { useNavigate } from "react-router-dom";
import {loginSuccess} from "../../Redux/Slices/authSlice"
import "../../styles/Login.css";
import axios from "axios";
import {jwtDecode} from "jwt-decode";
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
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });
      const { access, refresh} = response.data.tokens;
      const user={
        username:response.data.username,
        email:response.data.email
      }
      console.log(user);
      
      setSuccess("You're Logged IN Successfully");
      console.log("success", response.data);
      
      dispatch(
        loginSuccess({
          user,
          accessToken: access,
          refreshToken: refresh,
        })
      );

  
  
      if (access) {
        const decoded = jwtDecode(access);
        console.log(decoded.is_staff);
        
        if (decoded.is_staff) {
            console.log('Admin detected');
            setTimeout(() => {
              navigate("/instructor/"); // Redirect admin to admin panel
            }, 2000);
        } else {
            setTimeout(() => {
                navigate("/"); // Redirect normal user to home
            }, 2000);
        }
    }
    

      
      dispatch(setTokens({
        accessToken: response.data.tokens.access,
        refreshToken: response.data.tokens.refresh,
      }));//faid and remove this slice   
      localStorage.setItem("accessToken", response.data.tokens.access);
      localStorage.setItem("refreshToken", response.data.tokens.refresh);
    } catch (error) {
      console.log("error during login!", error.response?.data);
      dispatch(setError(error.response?.data || "An error occurred"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="auth-page"> {/* This class was missing */}
      <div className="login-container">
        <div className="form-box">
          <h2>Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
              <input
                type="email"
                required
                name="email"
                value={email}
                onChange={handleChange}
              />
              <label>Email</label>
            </div>
            <div className="input-box">
              <input
                type="password"
                required
                name="password"
                value={password}
                onChange={handleChange}
              />
              <label>Password</label>
            </div>
            <button type="submit" className="submit-btn" disabled={isLoading}>
              Submit
            </button>
          </form>
          <p className="login-link">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
          <p className="login-link">
            Forget Password? <a href="/forgot-password/">?</a>
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
  );
};

export default Login;
