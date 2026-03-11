import React, { useState } from "react";
import { axiosWebsite, URL_BASE } from "../../Config";
import { toast } from "react-toastify";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required");
      return;
    }

    try {
      await axiosWebsite.post("/contact", formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container py-5">
      {/* Heading */}
      <div className="text-center mb-5">
        <h1 className="fw-bold">Contact Us</h1>
        <p className="text-muted mt-2">
          We'd love to hear from you. Get in touch with us!
        </p>
      </div>

      <div className="row">
        {/* Contact Form */}
        <div className="col-md-7">
          <div className="card shadow p-4">
            <h4 className="mb-4">Send us a Message</h4>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <textarea
                  name="message"
                  className="form-control"
                  rows="5"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-danger">
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Company Info */}
        <div className="col-md-5">
          <div className="card shadow p-4 mb-4">
            <h4>Contact Information</h4>
            <p className="mt-3">
              <strong>Address:</strong>
              <br />
              123 Main Street, Your City, India
            </p>
            <p>
              <strong>Email:</strong>
              <br />
              support@yourwebsite.com
            </p>
            <p>
              <strong>Phone:</strong>
              <br />
              +91 9876543210
            </p>
          </div>

          {/* Google Map */}
          <div className="card shadow">
            <iframe
              title="location"
              src="https://www.google.com/maps/embed?pb=!1m18!..."
              width="100%"
              height="250"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
