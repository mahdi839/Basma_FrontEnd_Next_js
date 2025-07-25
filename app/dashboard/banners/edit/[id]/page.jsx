"use client";
import useShowData from "@/app/hooks/useShowData";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function page() {
  const { id } = useParams();
  const { showData, loading, data } = useShowData();
  const [slot, setSlot] = useState(null);
  const [formData, setFormData] = useState({
    link: "",
    type: "",
    products_slots_id: "",
    category_id: "",
    images: [],
  });
  const slotUrl = process.env.BACKEND_URL + `api/product-slots`;
  async function getSlotData() {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(slotUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSlot(response.data.data);
    } catch (err) {
      Swal.fire({
        title: "Oops! Please Check",
        text: err.response?.data?.message || err.message,
        icon: "error",
      });
    }
  }
  const url = process.env.BACKEND_URL + `api/banners/${id}`;
  useEffect(() => {
    showData(url);
    getSlotData();
  }, [url]);

  useEffect(() => {
    if (data) {
      setFormData({
        link: data.link || "",
        type: data.type || "",
        products_slots_id: data.products_slots_id || "",
        category_id: data.category_id || "",
        images: data.images || [],
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeFileChange = () => {};

  const handleSubmit = () => {};

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light p-3">
      <div
        className="card shadow-lg rounded-3 border-0 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div
          className="card-header  text-white py-3 rounded-top-3"
          style={{ background: "#7d59bf" }}
        >
          <h5 className="mb-0 text-center">Add Banner Images</h5>
        </div>

        <div className="card-body p-4">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Slot Name */}
              <div
                className={`${
                  formData.type === "category" || "slot"
                    ? "col-md-6"
                    : "col-md-12"
                }`}
              >
                <div className="">
                  <select
                    name="type"
                    className="form-select border-secondary"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    <option value="hero">Hero Section Slider</option>
                    <option value="slot">Slot</option>
                    <option value="category">Category</option>
                  </select>
                </div>
              </div>

              {formData.type === "category" && (
                <div className="col-md-6">
                  <div className="">
                    <select
                      className="form-select border-secondary"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {data?.data?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {formData.type === "slot" && (
                <div className="col-md-6">
                  <div className="">
                    <select
                      className="form-select border-secondary"
                      name="products_slots_id"
                      value={formData.products_slots_id}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        Select Slot
                      </option>
                      {slot?.map((singleSlot) => (
                        <option key={singleSlot.id} value={singleSlot.id}>
                          {singleSlot.slot_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* images */}
              <div className="col-md-6">
                <div className="form">
                  <input
                    type="file"
                    className="form-control border-secondary"
                    id="images"
                    placeholder="Select Image"
                    name="images"
                    multiple={formData.type == "hero"}
                    required
                    onChange={handleChangeFileChange}
                  />
                   <div className="d-flex gap-3 mt-2">
                      {data?.banner_images?.map((img) => (
                        <Image
                          className="ml-2 rounded "
                          src={`${process.env.BACKEND_URL}storage/${img.path}`}
                          width={50}
                          height={50}
                        />
                      ))}
              </div>
                </div>
              </div>

              {/* links */}
              <div className="col-md-6">
                <div className="form">
                  <input
                    type="text"
                    className="form-control border-secondary"
                    id="link"
                    placeholder="Give link"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                  />
                </div>
              </div>

             
            </div>

            {/* Submit Button */}
            <div className="mt-5 pt-3 border-top col-12">
              <div className="d-flex gap-2 justify-content-center">
                <button type="submit" className="dashboard-btn">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
