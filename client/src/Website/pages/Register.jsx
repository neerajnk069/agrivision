import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosWebsite } from "../../Config";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
    image: null,
    roll: "1",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!formData.name) newErrors.name = "Please enter your name";
    if (!formData.email) newErrors.email = "Please enter your email";
    if (!formData.phoneNumber)
      newErrors.phoneNumber = "Please enter your phone number";
    if (!formData.password) newErrors.password = "Please enter your password";
    if (!formData.role) newErrors.role = "Please select role";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value.replace(/\s/g, "") });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phoneNumber", formData.phoneNumber);
      data.append("password", formData.password);
      data.append("role", formData.role);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const response = await axiosWebsite.post("/signup", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Signup successful!");

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userData", JSON.stringify(response.data.user));
      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      setLoading(false);
    }
  };

  return (
    <div id="auth-wrapper">
      <div className="left-auth">
        <img
          src="assets/images/login_bg1.jpg"
          alt="Register"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      <div className="right-auth">
        <div className="flex-grow-1">
          <div className="authtitle mb-2">
            <img src="assets/images/logo_11.png" width={240} alt="Logo" />
          </div>

          <div className="font-size-18 fw-medium text-black mt-5">Register</div>

          {/* Name */}
          <div className="mb-3 pt-2">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className={`form-control logform ${
                errors.name ? "is-invalid" : ""
              }`}
              onChange={handleChange}
            />
            {errors.name && (
              <div className="invalid-feedback d-block">{errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`form-control logform ${
                errors.email ? "is-invalid" : ""
              }`}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          {/* Phone */}
          <div className="mb-3">
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              className={`form-control logform ${
                errors.phoneNumber ? "is-invalid" : ""
              }`}
              onChange={handleChange}
            />
            {errors.phoneNumber && (
              <div className="invalid-feedback d-block">
                {errors.phoneNumber}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className={`form-control logform ${
                errors.password ? "is-invalid" : ""
              }`}
              onChange={handleChange}
            />
            <button
              type="button"
              className="btn btn-link position-absolute"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                top: "50%",
                right: "12px",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
              }}
            >
              <i className={showPassword ? "ri-eye-line" : "ri-eye-off-line"} />
            </button>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          {/* Image Upload */}
          <div className="mb-3">
            <input
              type="file"
              name="image"
              className="form-control"
              accept="image/*"
              onChange={handleChange}
            />
          </div>
          {/* Role Selection */}
          <div className="mb-3">
            <label className="form-label">Register As</label>

            <div className="d-flex gap-3 mt-2">
              <div>
                <input
                  type="radio"
                  name="role"
                  value="1"
                  checked={formData.role === "1"}
                  onChange={handleChange}
                />
                <label className="ms-1">User</label>
              </div>

              <div>
                <input
                  type="radio"
                  name="role"
                  value="2"
                  checked={formData.role === "2"}
                  onChange={handleChange}
                />
                <label className="ms-1">Agent</label>
              </div>
            </div>

            {errors.role && (
              <div className="invalid-feedback d-block">{errors.role}</div>
            )}
          </div>

          <button
            onClick={handleRegister}
            className="btn btn-danger w-100 mt-3"
            disabled={loading}
          >
            {loading ? "Registering..." : "REGISTER"}
          </button>

          <div className="text-center mt-3">
            Already have an account?{" "}
            <span
              style={{ color: "red", cursor: "pointer" }}
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
