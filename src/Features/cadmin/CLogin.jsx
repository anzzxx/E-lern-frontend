import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Redux/Slices/cadminLoginSlice";
import { useNavigate } from "react-router-dom";
import "../../styles/clogin.css"

const  CLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, user } = useSelector((state) => state.cadminLogin);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser({ email, password })).then((result) => {
            if (result.meta.requestStatus === "fulfilled") {
                navigate("/admin-panel/"); // Redirect on success
            }
        });
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Admin Login</h2>
                {error && <p className="error">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default CLogin;
