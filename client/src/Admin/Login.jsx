import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance } from "../Config";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const validateEmail = (email) => {
    setEmailError(email ? "" : "Please enter your email");
  };

  const validatePassword = (password) => {
    setPasswordError(password ? "" : "Please enter your password");
  };

  const handleEmailChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\s/g, "");
    setEmail(value);
    validateEmail(value);
  };

  const handlePasswordChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\s/g, "");

    setPassword(value);
    validatePassword(value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loading) return;

    setFormError("");
    validateEmail(email);
    validatePassword(password);

    setLoading(true);

    try {
      const response = await axiosInstance.post("/login", {
        email,
        password,
      });
      toast.success("Login successful!");
      const userData = { ...response.data.body };
      delete userData.password;
      const token = userData.token;

      setTimeout(() => {
        localStorage.setItem("token", token);
        localStorage.setItem("userData", JSON.stringify(response.data.body));
        // navigate("/dashboard", { replace: true });
      }, 1500);

      if (userData.role === "0") {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
      console.log("ROLE user:", userData.role);
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.message || "Invalid email or password.",
        );
      } else {
        toast.error("Something went wrong. Please try again.");
      }
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin(e);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
  };

  return (
    <>
      <div id="auth-wrapper">
        <div className="left-auth">
          <img
            src="assets/images/login_bg1.jpg"
            alt="Logo"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className="right-auth">
          <div className="flex-grow-1">
            <div className="authtitle mb-2">
              <img src="assets/images/logo_11.png" width={240} alt="Logo" />
            </div>
            <div className="font-size-18 fw-medium text-black mt-5">Login </div>

            {formError && <div className="alert alert-danger">{formError}</div>}

            <div className="mb-3 pt-2">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                onKeyPress={handleKeyPress}
                onKeyDown={handleKeyDown}
                className={`form-control logform ${
                  emailError ? "is-invalid" : ""
                }`}
                placeholder="Email address"
                autoComplete="email"
                style={{ paddingRight: "15px" }}
              />
              {emailError && (
                <div className="invalid-feedback d-block">{emailError}</div>
              )}
            </div>

            <div className="mb-3">
              <div className="position-relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  onKeyPress={handleKeyPress}
                  onKeyDown={handleKeyDown}
                  className={`form-control logform ${
                    passwordError ? "is-invalid" : ""
                  }`}
                  placeholder="Password"
                  autoComplete="current-password"
                  style={{ paddingRight: "45px" }}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute bg-transparent"
                  onClick={togglePasswordVisibility}
                  style={{
                    top: "50%",
                    right: "12px",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    padding: "4px 8px",
                    color: "#6c757d",
                    textDecoration: "none",
                    zIndex: 5,
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    display: "block",
                    boxShadow: "none",
                  }}
                >
                  <i
                    className={showPassword ? "ri-eye-line" : "ri-eye-off-line"}
                    style={{ fontSize: "18px" }}
                  />
                </button>
              </div>
              {passwordError && (
                <div className="invalid-feedback d-block">{passwordError}</div>
              )}
            </div>

            <button
              onClick={handleLogin}
              id="login"
              className="btn btn-danger w-100 mt-3"
            >
              LOG IN
            </button>
            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <span
                style={{
                  color: "#dc3545",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
                onClick={() => navigate("/register")}
              >
                Register
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
