// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { axiosInstance, BASE_URL } from "../../Config";
// import { toast } from "react-toastify";

// const EditAgriculture = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     status: "1",
//   });

//   const [image, setImage] = useState(null);
//   const [preview, setPreview] = useState("");

//   useEffect(() => {
//     fetchNews();
//   }, []);

//   const fetchNews = async () => {
//     try {
//       const res = await axiosInstance.get(`/viewAgriculture/${id}`);
//       if (res.data.success) {
//         const data = res.data.body;
//         setFormData({
//           title: data.title,
//           description: data.description,
//           status: data.status,
//         });

//         if (data.image) {
//           setPreview(`${BASE_URL}/${data.image}`);
//         }
//       }
//     } catch {
//       toast.error("Failed to load news");
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     setImage(file);

//     if (file) {
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("status", formData.status);

//       if (image) {
//         data.append("image", image);
//       }

//       await axiosInstance.put(`/editAgriculture/${id}`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       toast.success("News updated successfully");
//       navigate("/agricultureList");
//     } catch (error) {
//       toast.error("Failed to update news");
//     }
//   };

//   return (
//     <div id="layout-wrapper">
//       <div className="main-content">
//         <div className="page-content">
//           <div className="container">
//             <h4>Edit Agriculture</h4>

//             <div className="card p-4 shadow-sm">
//               <form onSubmit={handleSubmit}>
//                 <strong>Title:</strong>
//                 <input
//                   type="text"
//                   className="form-control mb-3"
//                   value={formData.title}
//                   onChange={(e) =>
//                     setFormData({ ...formData, title: e.target.value })
//                   }
//                   placeholder="Title"
//                   required
//                 />
//                 <strong>Description:</strong>
//                 <textarea
//                   className="form-control mb-3"
//                   rows="5"
//                   value={formData.description}
//                   onChange={(e) =>
//                     setFormData({ ...formData, description: e.target.value })
//                   }
//                   placeholder="Description"
//                   required
//                 />
//                 <strong>Status:</strong>
//                 <select
//                   className="form-control mb-3"
//                   value={formData.status}
//                   onChange={(e) =>
//                     setFormData({ ...formData, status: e.target.value })
//                   }
//                 >
//                   <option value="1">Active</option>
//                   <option value="0">Inactive</option>
//                 </select>
//                 <strong>Image:</strong>
//                 {preview && (
//                   <div className="mb-3">
//                     <img
//                       src={preview}
//                       alt="Preview"
//                       style={{
//                         width: "150px",
//                         height: "150px",
//                         objectFit: "cover",
//                         borderRadius: "10px",
//                       }}
//                     />
//                   </div>
//                 )}

//                 <input
//                   type="file"
//                   className="form-control mb-3"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                 />

//                 <button className="btn btn-primary">Update</button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditAgriculture;
