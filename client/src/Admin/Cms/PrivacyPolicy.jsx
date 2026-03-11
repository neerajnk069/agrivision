import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import { axiosInstance } from "../../Config";

const PrivacyPolicy = () => {
  const [title, setTitle] = useState("");
  const [userContent, setUserContent] = useState("<p><br></p>");
  const [userError, setUserError] = useState("");
  const [userTouched, setUserTouched] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(true);
  const hasShownError = useRef(false);

  const isContentEmpty = (content) => {
    const plainText = content?.replace(/<[^>]*>?/gm, "") || "";
    return (
      plainText.trim() === "" || content === "<p><br></p>" || content === ""
    );
  };

  const fetchPrivacyPolicy = async () => {
    try {
      const response = await axiosInstance.get(`/privacypolicy`);
      const { data } = response.data;
      setTitle(data.title || "");
      setUserContent(data.content || "<p><br></p>");

      hasShownError.current = false;

      setUserTouched(false);
      setUserError("");
    } catch (error) {
      if (!hasShownError.current) {
        toast.error("Error fetching privacy policy data. Please try again.", {
          toastId: "fetch-privacy-policy-error",
        });
        hasShownError.current = true;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleUserContentChange = (content) => {
    setUserContent(content);
    setUserTouched(true);

    if (isContentEmpty(content)) {
      setUserError("User Privacy Policy cannot be empty.");
    } else {
      setUserError("");
    }
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();
    setUserTouched(true);

    if (isContentEmpty(userContent)) {
      setUserError("User Privacy Policy cannot be empty.");
      toast.error("User Privacy Policy cannot be empty.");
      return;
    }

    setUserError("");
    setSubmitError("");

    try {
      await axiosInstance.post(`/privacypolicy`, {
        title,
        content: userContent,
      });
      toast.success("User privacy policy updated successfully");
      setUserTouched(false);
      await fetchPrivacyPolicy();
    } catch (error) {
      setSubmitError("Error submitting user privacy policy. Please try again.");
      toast.error("Error submitting user privacy policy. Please try again.");
    }
  };

  return (
    <>
      <div id="layout-wrapper">
        <div className="main-content">
          <div className="page-content">
            <div className="container-fluid">
              <div className="title-box mb-3 pb-1">
                <h4 className="mb-0 page-title">Privacy Policy</h4>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <div className="card">
                    <div className="card-body">
                      {loading ? (
                        <p>Loading...</p>
                      ) : (
                        <>
                          <form onSubmit={handleUserSubmit}>
                            <div className="mb-3">
                              <label className="mb-1 fw-medium">Title</label>
                              <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={title}
                                onChange={handleTitleChange}
                                maxLength={50}
                                disabled
                              />
                            </div>

                            <div className="row mb-2">
                              <div className="col-12">
                                <div className="form-group">
                                  <label
                                    htmlFor="userContent"
                                    className="fw-medium"
                                  >
                                    Content{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <div style={{ position: "relative" }}>
                                    <ReactQuill
                                      id="userContent"
                                      style={{
                                        height: "250px",
                                        marginBottom: "50px",
                                        color: "black",
                                      }}
                                      theme="snow"
                                      value={userContent}
                                      onChange={handleUserContentChange}
                                      modules={{
                                        toolbar: [
                                          [
                                            { header: "1" },
                                            { header: "2" },
                                            { font: [] },
                                          ],
                                          [
                                            { list: "ordered" },
                                            { list: "bullet" },
                                          ],
                                          ["bold", "italic", "underline"],
                                          [{ color: [] }, { background: [] }],
                                          [{ align: [] }],
                                          ["clean"],
                                        ],
                                      }}
                                    />
                                  </div>
                                  {userError && userTouched && (
                                    <p className="text-danger mt-4 mb-0">
                                      <i className="ri-error-warning-line me-1"></i>
                                      {userError}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="text-end mb-4">
                              <button
                                type="submit"
                                className="btn btn-danger px-4"
                                disabled={
                                  !userTouched || isContentEmpty(userContent)
                                }
                              >
                                Update Content
                              </button>
                            </div>
                          </form>
                        </>
                      )}
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

export default PrivacyPolicy;
