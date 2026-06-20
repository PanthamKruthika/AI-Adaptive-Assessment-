import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./api";

const Login = ({ onBack, onLoginSuccess }) => {
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const resetMessages = () => {
    setError("");
    setSuccess("");
  };

  const handleToggleMode = () => {
    setIsRegistering((prev) => !prev);
    resetMessages();
    resetForm();
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    resetMessages();

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    if (isRegistering) {
      if (!formData.username) {
        setError("Username is required.");
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (isRegistering) {
        await api.post("/register/", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        setSuccess("Account created! Please Sign In.");
        setIsRegistering(false);
        resetForm();
      } else {
        const res = await api.post("/token/", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("access_token", res.data.access);
        localStorage.setItem("refresh_token", res.data.refresh);

        if (onLoginSuccess) {
          onLoginSuccess();
        } else {
          navigate("/subjects");
        }
      }
    } catch (err) {
      if (err.response?.data) {
        const apiError = err.response.data;
        const message =
          typeof apiError === "string"
            ? apiError
            : Object.values(apiError).flat().join(" ");

        setError(message || "Authentication failed.");
      } else if (err.request) {
        setError("No response from server.");
      } else {
        setError("Unexpected error.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>
          {isRegistering ? "Create Account" : "Sign In"}
        </h2>

        <form onSubmit={handleAuth}>
          {isRegistering && (
            <input
              name="username"
              placeholder="Username"
              style={inputStyle}
              onChange={handleChange}
              value={formData.username}
              required
            />
          )}

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            style={inputStyle}
            onChange={handleChange}
            value={formData.email}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            style={inputStyle}
            onChange={handleChange}
            value={formData.password}
            required
          />

          {isRegistering && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              style={inputStyle}
              onChange={handleChange}
              value={formData.confirmPassword}
              required
            />
          )}

          {error && <p style={errorTextStyle}>{error}</p>}
          {success && <p style={successTextStyle}>{success}</p>}

          <button type="submit" style={actionBtnStyle} disabled={isLoading}>
            {isLoading ? "Please wait..." : isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p style={toggleTextStyle}>
          {isRegistering ? "Already have an account?" : "New to the platform?"}
          <span style={linkStyle} onClick={handleToggleMode}>
            {isRegistering ? " Sign In" : " Register Now"}
          </span>
        </p>

        <p
          style={backTextStyle}
          onClick={() => (onBack ? onBack() : navigate("/"))}
        >
          ← Back to Home
        </p>
      </div>
    </div>
  );
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
  boxSizing: "border-box",
  color: "white",
};

const cardStyle = {
  background: "rgba(255,255,255,0.05)",
  padding: "50px 40px",
  borderRadius: "20px",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.1)",
  width: "100%",
  maxWidth: "480px",
  textAlign: "center",
  boxShadow: "0 15px 35px rgba(0,0,0,0.5)",
};

const titleStyle = {
  marginBottom: "30px",
  color: "#eae4d5",
  fontSize: "2.2rem",
  fontFamily: "fangsong",
};

const inputStyle = {
  width: "100%",
  padding: "15px",
  margin: "12px 0",
  borderRadius: "8px",
  border: "none",
  background: "rgba(255,255,255,0.1)",
  color: "white",
  fontSize: "1rem",
  outline: "none",
  boxSizing: "border-box",
};

const actionBtnStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "25px",
  backgroundColor: "#7174aa",
  color: "white",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer",
  fontSize: "1.1rem",
  transition: "all 0.3s ease",
};

const errorTextStyle = {
  color: "#ff6b6b",
  fontSize: "0.85rem",
  marginTop: "10px",
  textAlign: "left",
};

const successTextStyle = {
  color: "#2ecc71",
  fontSize: "0.85rem",
  marginTop: "10px",
  textAlign: "left",
};

const toggleTextStyle = {
  fontSize: "0.95rem",
  marginTop: "25px",
  opacity: 0.8,
};

const linkStyle = {
  color: "#7174aa",
  cursor: "pointer",
  fontWeight: "bold",
  marginLeft: "5px",
};

const backTextStyle = {
  fontSize: "0.85rem",
  marginTop: "20px",
  cursor: "pointer",
  opacity: 0.6,
  transition: "opacity 0.2s",
};

export default Login;