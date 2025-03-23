import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../Redux/Slices/signupSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(null);
  const { loading, error } = useSelector((state) => state.signup);

  const [formdata, setFormData] = useState({
    username: "",
    email: "",
    password1: "",
    password2: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formdata,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(null); // Reset success message before submission

    dispatch(registerUser(formdata))
      .unwrap()
      .then((response) => {
        setSuccess("Registration successful! You can now log in.");
        setFormData({ username: "", email: "", password1: "", password2: "" }); // Reset form

        localStorage.setItem("user", JSON.stringify(response)); // Store user in localStorage

        setTimeout(() => {
          navigate("/otp-validation");
        }, 2000);
      })
      .catch((err) => console.error("Registration Error:", err));
  };

  useEffect(() => {
    if (success) {
      setTimeout(() => navigate("/otp-validation"), 2000);
    }
  }, [success, navigate]);

  return (
    <div className="auth-page">
      <div className="login-container">
        <div className="form-box">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-box">
            <label>Name</label>
              <input
                type="text"
                required
                name="username"
                value={formdata.username}
                onChange={handleChange}
              />
             
            </div>
            <div className="input-box">
            <label>Email</label>
              <input
                type="email"
                required
                name="email"
                value={formdata.email}
                onChange={handleChange}
              />
              
            </div>
            <div className="input-box">
            <label>Password</label>
              <input
                type="password"
                required
                name="password1"
                value={formdata.password1}
                onChange={handleChange}
              />
             
            </div>
            <div className="input-box">
            <label>Confirm Password</label>
              <input
                type="password"
                required
                name="password2"
                value={formdata.password2}
                onChange={handleChange}
              />
              
            </div>
            <br />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <div className="spinner"></div>
              ) : (
                "Submit"
              )}
            </button>
          </form>
          <p className="login-link">
            Have an account? <a href="/login">Login</a>
          </p>
          {success && <p className="success-message">{success}</p>}
          {error &&
            (typeof error === "object" ? (
              <ul className="error-message">
                {Object.values(error)
                  .flat()
                  .map((msg, index) => (
                    <li key={index}>{msg}</li>
                  ))}
              </ul>
            ) : (
              <p className="error-message">{error}</p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Signup;
