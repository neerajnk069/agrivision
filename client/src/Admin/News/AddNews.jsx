import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { axiosInstance } from "../../Config";

const AddNews = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim() || !formData.image) {
      toast.error("All fields are required");
      return;
    }

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      data.append("created_by", 1);
      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axiosInstance.post("/addNews", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success("News added successfully");
        navigate("/newsList");
      }
    } catch (error) {
      toast.error("Failed to add news");
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
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container">
            <h4>Add News</h4>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="title"
                className="form-control mb-3"
                placeholder="Title"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />

              <textarea
                name="content"
                className="form-control mb-3"
                placeholder="Description"
                rows="5"
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />

              <input
                type="file"
                name="image"
                className="form-control mb-3"
                accept="image/*"
                onChange={handleChange}
              />

              <button className="btn btn-primary">Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNews;
