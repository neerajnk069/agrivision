import React, { useState } from "react";
import { toast } from "react-toastify";
import { axiosInstance } from "../Config";
import { Link } from "react-router-dom";

const Password = () => {
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (/\s/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        password: "Password cannot contain spaces",
      }));
    } else if (!value) {
      setErrors((prev) => ({ ...prev, password: "This field is required" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (/\s/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password cannot contain spaces",
      }));
    } else if (!value) {
      setErrors((prev) => ({ ...prev, newPassword: "This field is required" }));
    } else if (value.length < 4) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must be at least 5 characters",
      }));
    } else if (value.length > 50) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Password must not exceed 50 characters",
      }));
    } else if (password === value) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "New password cannot be the same as the old password",
      }));
    } else {
      setErrors((prev) => ({ ...prev, newPassword: "" }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (/\s/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Password cannot contain spaces",
      }));
    } else if (!value) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "This field is required",
      }));
    } else if (newPassword !== value) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "New password and confirm password do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: "" }));
    }
  };

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const toggleShowNewPassword = () => setShowNewPassword((prev) => !prev);
  const toggleShowConfirmPassword = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    let formIsValid = true;
    let formErrors = { ...errors };

    if (!password) {
      formErrors.password = "This field is required";
      formIsValid = false;
    } else if (/\s/.test(password)) {
      formErrors.password = "Password cannot contain spaces";
      formIsValid = false;
    }

    if (!newPassword) {
      formErrors.newPassword = "This field is required";
      formIsValid = false;
    } else if (/\s/.test(newPassword)) {
      formErrors.newPassword = "Password cannot contain spaces";
      formIsValid = false;
    } else if (newPassword.length > 50) {
      formErrors.newPassword = "Password must not exceed 50 characters";
      formIsValid = false;
    } else if (password === newPassword) {
      formErrors.newPassword =
        "New password cannot be the same as the old password";
      formIsValid = false;
    }

    if (!confirmPassword) {
      formErrors.confirmPassword = "This field is required";
      formIsValid = false;
    } else if (/\s/.test(confirmPassword)) {
      formErrors.confirmPassword = "Password cannot contain spaces";
      formIsValid = false;
    } else if (newPassword !== confirmPassword) {
      formErrors.confirmPassword =
        "New password and confirm password do not match";
      formIsValid = false;
    }

    setErrors(formErrors);
    if (!formIsValid) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        `/updatepassword`,
        { password, newPassword },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.body.token);
        toast.success("Your password was reset successfully");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error(response.data.message || "Password reset failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">Change Password</h4>
                <nav aria-label="breadcrumb" className="mt-1">
                  <ol className="breadcrumb align-items-center mb-0">
                    <li className="breadcrumb-item">
                      <Link to="/dashboard" className="new">
                        <i className="ri-home-4-fill me-1"></i> Home
                      </Link>
                    </li>
                    <li className="breadcrumb-item">
                      <Link to="/" className="new">
                        <i className="ri-settings-3-line me-1"></i> Settings
                      </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                      Change Password
                    </li>
                  </ol>
                </nav>
              </div>

              <div className="row justify-content-center">
                <div className="col-lg-8">
                  <div className="card">
                    <div className="card-body">
                      <div className="text-center mb-4">
                        <img
                          src="assets/images/keyimg.png"
                          style={{ width: "200px" }}
                          alt="Key"
                        />
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="mb-1 fw-medium">
                            Current Password
                          </label>
                          <div className="position-relative">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control"
                              placeholder="Current password"
                              value={password}
                              onChange={handlePasswordChange}
                              maxLength={50}
                              disabled={loading}
                            />
                            <i
                              className={`ri-eye${
                                showPassword ? "-fill" : "-off-fill"
                              } toggle-password`}
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "6px",
                                cursor: loading ? "not-allowed" : "pointer",
                              }}
                              onClick={loading ? undefined : toggleShowPassword}
                            ></i>
                            {errors.password && (
                              <div className="text-danger">
                                {errors.password}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="mb-1 fw-medium">New Password</label>
                          <div className="position-relative">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              className="form-control"
                              placeholder="New password"
                              value={newPassword}
                              onChange={handleNewPasswordChange}
                              maxLength={50}
                              disabled={loading}
                            />
                            <i
                              className={`ri-eye${
                                showNewPassword ? "-fill" : "-off-fill"
                              } toggle-password`}
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "6px",
                                cursor: loading ? "not-allowed" : "pointer",
                              }}
                              onClick={
                                loading ? undefined : toggleShowNewPassword
                              }
                            ></i>
                            {errors.newPassword && (
                              <div className="text-danger">
                                {errors.newPassword}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="mb-1 fw-medium">
                            Confirm Password
                          </label>
                          <div className="position-relative">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="form-control"
                              placeholder="Confirm password"
                              value={confirmPassword}
                              onChange={handleConfirmPasswordChange}
                              maxLength={50}
                              disabled={loading}
                            />
                            <i
                              className={`ri-eye${
                                showConfirmPassword ? "-fill" : "-off-fill"
                              } toggle-password`}
                              style={{
                                position: "absolute",
                                right: "10px",
                                top: "6px",
                                cursor: loading ? "not-allowed" : "pointer",
                              }}
                              onClick={
                                loading ? undefined : toggleShowConfirmPassword
                              }
                            ></i>
                            {errors.confirmPassword && (
                              <div className="text-danger">
                                {errors.confirmPassword}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="text-end mt-4">
                          <button
                            type="submit"
                            className="btn btn-danger px-4"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                ></span>
                                Processing...
                              </>
                            ) : (
                              "Change Password"
                            )}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Password;
