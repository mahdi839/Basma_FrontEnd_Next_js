"use client";
import React, { useEffect, useState } from "react";
import useStoreData from "@/app/hooks/useStoreData";
import useUpdateData from "@/app/hooks/useUpdateData";
import useShowData from "@/app/hooks/useShowData";
import Loading from "@/app/loading";

export default function SocialLinksForm() {
  const { storeData, loading: storeLoading } = useStoreData();
  const { updateData, loading: updateLoading } = useUpdateData();
  const { showData, loading: fetchLoading, data } = useShowData();

  const [formData, setFormData] = useState({
    facebook: "",
    youtube: "",
    instagram: "",
    tweeter: "",
    pinterest: "",
  });

  const [recordId, setRecordId] = useState(null);

  // Fetch existing social links on mount
  useEffect(() => {
    showData(process.env.BACKEND_URL + "api/social-links-first"); 
  }, []);

  
  useEffect(() => {
    if (data) {
      setFormData({
        facebook: data.facebook || "",
        youtube: data.youtube || "",
        instagram: data.instagram || "",
        tweeter: data.tweeter || "",
        pinterest: data.pinterest || "",
      });
      setRecordId(data.id);
    }
  }, [data]);

  // Input change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit handler for store or update
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Choose store or update based on presence of recordId
    if (recordId) {
      await updateData(
        `${process.env.BACKEND_URL}api/social-links/${recordId}`,
        formData,
        "Social links updated!",
        ""
      );
    } else {
      await storeData(
        process.env.BACKEND_URL + "api/social-links",
        formData,
        "Social links saved!"
      );
    }

    // Refetch to update the form
    showData(process.env.BACKEND_URL + "api/social-links-first");
  };

  if (fetchLoading) {
    return (
      <div className="text-center mt-5">
        <Loading animation="border" /> Loading...
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div
        className="card shadow-lg rounded-3 border-0 w-100"
        style={{ maxWidth: "600px" }}
      >
        <div
          className="card-header text-white py-3 rounded-top-3"
          style={{ background: "#7d59bf" }}
        >
          <h5 className="mb-0 text-center">Social Links</h5>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit} autoComplete="off">
            {[
              { label: "Facebook", name: "facebook" },
              { label: "YouTube", name: "youtube" },
              { label: "Instagram", name: "instagram" },
              { label: "Tweeter", name: "tweeter" },
              { label: "Pinterest", name: "pinterest" },
            ].map(({ label, name }) => (
              <div className="mb-3" key={name}>
                <label className="form-label fw-semibold">{label}</label>
                <input
                  type="url"
                  name={name}
                  className="form-control"
                  placeholder={`Enter ${label} URL`}
                  value={formData[name]}
                  onChange={handleInputChange}
                />
              </div>
            ))}

            <div className="mt-4 pt-2 border-top">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={storeLoading || updateLoading}
              >
                {storeLoading || updateLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
