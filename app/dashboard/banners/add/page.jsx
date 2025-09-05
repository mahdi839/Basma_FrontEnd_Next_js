"use client";
import useIndexData from "@/app/hooks/useIndexData";
import useStoreData from "@/app/hooks/useStoreData";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {
  const [formData, setFormData] = useState({
    link: "",
    type: "",
    products_slots_id: "",
    category_id: "",
    images: [],
  });
  const [slot, setSlot] = useState(null);
  const { indexData, loading, data, setData } = useIndexData();
  const categoryIndeUrl = process.env.BACKEND_URL + `api/categories`;
  const slotUrl = process.env.BACKEND_URL + `api/product-slots`;
  const router = useRouter()
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

  useEffect(() => {
    indexData(categoryIndeUrl);
    getSlotData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChangeFileChange = (e) => {
     // Convert FileList to Array
  const filesArray = Array.from(e.target.files);
  setFormData({ ...formData, images: filesArray });
  };


  const { storeData, loading: storeLoading } = useStoreData();

  const handleSubmit = async (e) => {
    e.preventDefault();

      // Validation: Check if images are selected
  if (!formData.images || formData.images.length === 0) {
    Swal.fire({
      title: "Error",
      text: "Please select at least one image",
      icon: "error",
    });
    return;
  }


    const payload = new FormData();
    payload.append("link", formData.link);
    payload.append("type", formData.type);
    if (formData.type === "slot") {
      payload.append("products_slots_id", formData.products_slots_id);
    }

    if (formData.type === "category") {
      payload.append("category_id", formData.category_id);
    }

     // Append each file individually
  formData.images.forEach((file, index) => {
    payload.append(`images[${index}]`, file);
  });

    console.log("FormData contents:");
  for (let [key, value] of payload.entries()) {
    console.log(key, value);
  }

    await storeData(
      process.env.BACKEND_URL + "api/banners",
      payload,
      "Banner created successfully"
    );

    setFormData({
      link: "",
      type: "",
      category_id: "",
      images: [],
    });

    document.getElementById("images").value = null;
    router.push('/dashboard/banners')
  };

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
                  {storeLoading?'Saving...':'Save'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
