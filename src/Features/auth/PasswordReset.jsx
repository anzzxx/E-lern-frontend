import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../Redux/api";
import "../../styles/Login.css"; 

const ResetPassword = () => {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post(`api/reset-password/${uid}/${token}/`, { password });
      setMessage(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired token.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
   
    <div className="auth-page">
      <div className="login-container">
        <div className="form-box">
          <h2>Reset Password</h2>
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="input-box">
            <label>New Password</label>
              <input
                type="password"
                required
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              
            </div>
            <div className="input-box">
            <label>Confirm Password</label>
              <input
                type="password"
                required
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              
            </div>
            <br />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <div className="spinner"></div> : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default ResetPassword;
