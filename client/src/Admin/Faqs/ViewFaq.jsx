import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { axiosInstance, BASE_URL } from "../../Config";

const ViewFaq = () => {
  const { id } = useParams();
  const [faq, setFaq] = useState(null);

  useEffect(() => {
    fetchFaq();
  }, []);

  const fetchFaq = async () => {
    try {
      const res = await axiosInstance.get(`viewFaq/${id}`);
      if (res.data.success) {
        setFaq(res.data.body);
      }
    } catch (error) {
      console.log("Fetch Error:", error);
    }
  };

  if (!faq) return <div className="text-center py-5">Loading...</div>;

  return (
    <div id="layout-wrapper">
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <div className="title-box mb-3 pb-1">
              <h4 className="mb-0 page-title">View FAQ</h4>
            </div>

            <div className="card">
              <div className="card-body">
                <div className="mb-3">
                  <strong>Question:</strong>
                  <p>{faq.question}</p>
                </div>

                <div className="mb-3">
                  <strong>Answer:</strong>
                  <p>{faq.answer}</p>
                </div>

                <Link to="/faqlist" className="btn btn-secondary">
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewFaq;
