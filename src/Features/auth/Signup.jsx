import React, { useState } from "react";
import {useDispatch,useSelector} from "react-redux"
import { registerUser } from "../../Redux/Slices/signupSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/Login.css";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [success, setSuccess] = useState(null);
  const { loading, error } = useSelector((state) => state.signup);
  console.log(loading);
  console.log(error);
  
  

  const[formdata,setFormData]=useState({
    username:"",
    email:"",
    password1:"",
    password2:""
  });
  

  const handleChange=(e)=>{
    setFormData({
      ...formdata,[e.target.name]:e.target.value,
    })
   
  }

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
          navigate("otp-validation/");
        }, 2000);
      })
      .catch(() => {}); // Error already handled in Redux state
  };
  

  return (
    <div className="auth-page">
    <div className="login-container">
      
      <div className="form-box">
        <h2>Sign Up</h2>
        <form  onSubmit={handleSubmit}>
          <div className="input-box">
            <input type="text" required name="username" value={formdata.username} onChange={handleChange}/>
            <label>Name</label>
          </div>
          <div className="input-box">
            <input type="email" required name="email" value={formdata.email} onChange={handleChange} />
            <label>Email</label>
          </div>
          <div className="input-box">
            <input type="password" required name="password1" value={formdata.password1} onChange={handleChange} />
            <label>Password</label>
          </div>
          <div className="input-box">
            <input type="password" required name="password2" value={formdata.password2} onChange={handleChange}/>
            <label>Confirm Password</label>
          </div>
          <br />
          <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Submitting..." : "Submit"} 
          </button>
        </form>
        <p className="login-link">
          Have an account? <a href="/login">Login</a>

          {success && <p className="success-message">{success}</p>}
          <br />
          {error && typeof error === "object" ? (
          <ul className="error-message">
              {Object.values(error).flat().map((msg, index) => (
              <li key={index}>{msg}</li>
               ))}
          </ul>
            ) : (
          error && <p className="error-message">{error}</p>
          )}

        </p>
      </div>
    </div>
    </div>
  );
};

export default Signup;