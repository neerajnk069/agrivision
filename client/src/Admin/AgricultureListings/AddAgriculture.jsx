// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// import { axiosInstance } from "../../Config";

// const AddAgriculture = () => {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     agent_id :"",
//     title: "",
//     description: "",
//     image: null,
//   });

//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       setFormData({ ...formData, image: e.target.files[0] });
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title || !formData.description) {
//       toast.error("All fields are required");
//       return;
//     }

//     try {
//       const data = new FormData();
//       data.append("title", formData.title);
//       data.append("description", formData.description);
//       data.append("created_by", 1);
//       if (formData.image) {
//         data.append("image", formData.image);
//       }

//       const res = await axiosInstance.post("/addAgriculture", data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       if (res.data.success) {
//         toast.success("Agriculture added successfully");
//         navigate("/agricultureList");
//       }
//     } catch (error) {
//       toast.error("Failed to add service");
//     }
//   };

//   return (
//     <div id="layout-wrapper">
//       <div className="main-content">
//         <div className="page-content">
//           <div className="container">
//             <h4>Add Agriculture</h4>

//             <form onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="title"
//                 className="form-control mb-3"
//                 placeholder="Title"
//                 onChange={handleChange}
//               />

//               <textarea
//                 name="description"
//                 className="form-control mb-3"
//                 placeholder="Description"
//                 rows="5"
//                 onChange={handleChange}
//               />

//               <input
//                 type="file"
//                 name="image"
//                 className="form-control mb-3"
//                 accept="image/*"
//                 onChange={handleChange}
//               />

//               <button className="btn btn-primary">Submit</button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddAgriculture;
