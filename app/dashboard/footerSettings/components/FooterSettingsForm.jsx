"use client";

import React, { useEffect, useRef, useState } from "react";
import useStoreData from "@/app/hooks/useStoreData";
import useUpdateData from "@/app/hooks/useUpdateData";
import useShowData from "@/app/hooks/useShowData";
import Loading from "@/app/loading";

export default function FooterSettingsForm() {
  const { storeData, loading: storeLoading } = useStoreData();
  const { updateData, loading: updateLoading } = useUpdateData();
  const { showData, loading: fetchLoading, data } = useShowData();

  const [formData, setFormData] = useState({
    company_description: "",
    company_address: "",
    company_email: "",
    company_phone: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [recordId, setRecordId] = useState(null);

  useEffect(() => {
   showData(process.env.BACKEND_URL+"api/footer-settings/1");
  }, []);

  useEffect(() => {
    if (data) {
      setFormData({
        company_description: data.company_description || "",
        company_address: data.company_address || "",
        company_email: data.company_email || "",
        company_phone: data.company_phone || "",
      });
      setRecordId(data.id);
      if (data.logo_path) {
        setPreviewUrl(data.logo_path);
      }
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setLogoFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = new FormData();
    payload.append("company_description", formData.company_description);
    payload.append("company_address", formData.company_address);
    payload.append("company_email", formData.company_email);
    payload.append("company_phone", formData.company_phone);
    if (logoFile) {
      payload.append("logo_path", logoFile);
    }

    if (recordId) {
      await updateData(
        ` ${process.env.BACKEND_URL}api/footer-settings/${recordId}`,
        payload,
        "Footer settings updated!",
        ""
      );
    } else {
      await storeData(process.env.BACKEND_URL+"api/footer-settings", payload, "Footer settings saved!");
    }

    showData(process.env.BACKEND_URL+"api/footer-settings/1");
  };

  if (fetchLoading) {
    return (
      <div className="text-center mt-5">
        <Loading animation="border" /> Loading...
      </div>
    );
  }

  return (
    <form className="container mt-4" onSubmit={handleSubmit} encType="multipart/form-data">
      <h3 className="mb-4">Footer Settings</h3>

      {/* Logo Upload */}
      <div className="mb-3">
        <label className="form-label">Company Logo</label>
        <input type="file" className="form-control" onChange={handleFileChange} />
        {previewUrl && (
          <img src={previewUrl} alt="Logo Preview" className="mt-2" style={{ maxWidth: "200px", height: "auto" }} />
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Company Description</label>
        <textarea
          name="company_description"
          className="form-control"
          value={formData.company_description}
          onChange={handleInputChange}
        ></textarea>
      </div>

      <div className="mb-3">
        <label className="form-label">Company Address</label>
        <input
          type="text"
          name="company_address"
          className="form-control"
          value={formData.company_address}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Company Email</label>
        <input
          type="email"
          name="company_email"
          className="form-control"
          value={formData.company_email}
          onChange={handleInputChange}
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Company Phone</label>
        <input
          type="text"
          name="company_phone"
          className="form-control"
          value={formData.company_phone}
          onChange={handleInputChange}
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary"
        disabled={storeLoading || updateLoading}
      >
        {storeLoading || updateLoading ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
