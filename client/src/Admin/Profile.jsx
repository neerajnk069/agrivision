import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance, BASE_URL } from "../Config";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    image: "",
    // countryCode: "",
    // adminCommission: ""
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No token found. Please log in again.");
        return;
      }

      try {
        const response = await axiosInstance.get(`/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && response.data.body) {
          setData(response.data.body);
          const imageUrl = response.data.body.image.startsWith("http")
            ? response.data.body.image
            : `${BASE_URL}/${response.data.body.image}`;
          setImagePreview(imageUrl);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfileData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.startsWith(" ")) return "Name cannot start with a space";
    if (name.length < 2 || name.length > 20)
      return "Name must be between 2 and 20 characters";
    return "";
  };

  const validatePhone = (phoneNumber) => {
    const phoneRegex = /^[0-9]+$/;
    if (!phoneNumber) return "Phone number is required";
    if (phoneNumber.length < 8 || phoneNumber.length > 15)
      return "Phone number must be between 8 and 15 digits";
    if (!phoneRegex.test(phoneNumber))
      return "Phone number must contain only numbers";
    return "";
  };

  // const validateAdminCommission = (commission) => {
  //   if (!commission) return "Admin commission is required";
  //   if (isNaN(commission)) return "Admin commission must be a number";

  //   const commissionNum = parseFloat(commission);
  //   if (commissionNum < 0 || commissionNum > 99) {
  //     return "Admin commission must be between 0 and 99";
  //   }
  //   return "";
  // };

  const handleNameChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({ ...prevData, name: value }));
    const nameError = validateName(value);
    setErrors((prevErrors) => ({ ...prevErrors, name: nameError }));
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    setData((prevData) => ({ ...prevData, phoneNumber: value }));
    const phoneError = validatePhone(value);
    setErrors((prevErrors) => ({ ...prevErrors, phoneNumber: phoneError }));
  };

  // const handleAdminCommissionChange = (e) => {
  //   const { value } = e.target;
  //   const sanitizedValue = value.replace(/[^0-9.]/g, '');

  //   const decimalCount = (sanitizedValue.match(/\./g) || []).length;
  //   const finalValue = decimalCount > 1 ?
  //     sanitizedValue.slice(0, sanitizedValue.lastIndexOf('.')) :
  //     sanitizedValue;

  //   setData((prevData) => ({ ...prevData, adminCommission: finalValue }));
  //   const commissionError = validateAdminCommission(finalValue);
  //   setErrors((prevErrors) => ({ ...prevErrors, adminCommission: commissionError }));
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let formErrors = {};

    const nameError = validateName(data.name);
    const phoneError = validatePhone(data.phoneNumber);

    if (nameError) formErrors.name = nameError;
    if (phoneError) formErrors.phoneNumber = phoneError;

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    // formData.append("adminCommission", data.adminCommission);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    try {
      const response = await axiosInstance.post(`/updateprofile`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedData = response.data.body;
      setData(updatedData);
      if (updatedData.image) {
        const imageUrl = updatedData.image.startsWith("http")
          ? updatedData.image
          : `${BASE_URL}/${updatedData.image}`;
        setImagePreview(imageUrl);
      }
      localStorage.setItem("userData", JSON.stringify(updatedData));
      toast.success("Profile updated successfully");
      navigate("/dashboard", { state: { updated: true } });
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      const value = e.target.value;
      if (value.endsWith("  ")) {
        e.preventDefault();
      }
    }
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">Edit Profile</h4>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      <div className="text-center mb-4">
                        <div className="position-relative d-inline-block">
                          <img
                            src={imagePreview || ""}
                            style={{
                              width: 200,
                              height: 200,
                              objectFit: "cover",
                              borderRadius: "20%",
                            }}
                            alt="Profile"
                          />
                          <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            style={{ display: "none" }}
                            onChange={handleImageChange}
                          />
                          <label
                            htmlFor="fileInput"
                            className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle p-2"
                            style={{ cursor: "pointer" }}
                          >
                            <FaEdit size={20} />
                          </label>
                        </div>
                      </div>
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label className="mb-1 fw-medium">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={data.name}
                            onChange={handleNameChange}
                            onKeyDown={handleKeyDown}
                            maxLength={50}
                          />
                          {errors.name && (
                            <div className="text-danger">{errors.name}</div>
                          )}
                        </div>

                        <div className="mb-3">
                          <label className="mb-1 fw-medium">Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={data.email}
                            onKeyDown={handleKeyDown}
                            disabled
                          />
                        </div>

                        <div className="mb-3 row">
                          {/* <div className="col-2">
                            <label className="mb-1 fw-medium">
                              Country Code
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              name="countryCode"
                              value={data.countryCode}
                              disabled
                            />
                          </div> */}
                          <div className="col-10">
                            <label className="mb-1 fw-medium">Mobile</label>
                            <input
                              type="text"
                              className="form-control"
                              name="phoneNumber"
                              value={data.phoneNumber}
                              onChange={handlePhoneChange}
                              onKeyDown={handleKeyDown}
                            />
                            {errors.phoneNumber && (
                              <div className="text-danger">
                                {errors.phoneNumber}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* <div className="mb-3">
                          <label className="mb-1 fw-medium">Admin Commission (%)</label>
                          <input
                            type="text"
                            className="form-control"
                            name="adminCommission"
                            value={data.adminCommission}
                            onChange={handleAdminCommissionChange}
                            placeholder="0 to 99"
                          />
                          {errors.adminCommission && (
                            <div className="text-danger">
                              {errors.adminCommission}
                            </div>
                          )}
                        </div> */}

                        <div className="text-end mb-2">
                          <button type="submit" className="btn btn-danger px-4">
                            Update
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

export default Profile;
