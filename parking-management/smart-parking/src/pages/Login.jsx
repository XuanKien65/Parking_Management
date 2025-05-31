import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authService.login(formData.email, formData.password);
      login(response.user);
      if (response.user.role === 'admin') {
        navigate("/dashboard");
    } else {
        navigate("/booking");
      }
    } catch (error) {
      setError(error.message || "Đăng nhập thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Đăng nhập</h2>
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email:
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email của bạn"
              required 
            />
          </label>

          <label>
            Mật khẩu:
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required 
            />
            </label>

          <button type="submit" className="btn-submit">
            Đăng nhập
          </button>
        </form>

        <p className="auth-link">
          Chưa có tài khoản?{" "}
          <Link to="/register">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
