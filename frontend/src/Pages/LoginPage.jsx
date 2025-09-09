import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Sprout, ArrowRight, Mail, Lock } from "lucide-react";
import "../Styles/LoginSignup.css";
import { useAuthStore } from "../stores/useAuthStore";

const LoginPage = () => {
  const {login}=useAuthStore();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear the error when user starts typing again
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      // Form is valid, proceed with login
      console.log("Login submitted:", formData);
      // Add API call or authentication logic here
    }
    login(formData);
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <Link to="/" className="auth-logo">
              <Sprout className="logo-icon" />
              <span className="logo-text">FarmConnect</span>
            </Link>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">
              Log in to access your farm data, insights, and recommendations.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                <Mail size={16} className="input-icon" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} className="input-icon" />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>

            <div className="form-actions">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label htmlFor="rememberMe">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="auth-btn">
              Login <ArrowRight className="btn-icon" size={16} />
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/signup" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="auth-image">
          <div className="auth-overlay">
            <div className="auth-overlay-content">
              <h2>Smart Farming for a Better Tomorrow</h2>
              <p>Log back into FarmConnect and continue making data-driven decisions for sustainable agriculture.</p>
              <div className="auth-features">
                <div className="auth-feature">
                  <Sprout className="auth-feature-icon" />
                  <span>Real-time crop monitoring</span>
                </div>
                <div className="auth-feature">
                  <Lock className="auth-feature-icon" />
                  <span>Secure access to your data</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;