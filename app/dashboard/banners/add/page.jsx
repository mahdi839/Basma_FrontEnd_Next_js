"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {

  const router = useRouter();

  const [bannerId, setBannerId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [banners, setBanners] = useState([{ image: null, link: "" }]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  /* ---------------- FETCH EXISTING HERO ---------------- */

  useEffect(() => {
    fetchBanner();
  }, []);

  const fetchBanner = async () => {
    try {
      const res = await axios.get(
        process.env.NEXT_PUBLIC_BACKEND_URL + "api/banners",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.data?.length) {
        const banner = res.data.data[0];

        setBannerId(banner.id);
        setExistingImages(banner.banner_images);
      }
    } catch (err) {
      console.log("No banner yet");
    } finally {
      setPageLoading(false);
    }
  };

  /* ---------------- ADD NEW IMAGE FIELD ---------------- */

  const addBannerField = () => {
    setBanners([...banners, { image: null, link: "" }]);
  };

  const handleBannerChange = (index, field, value) => {
    const updated = [...banners];
    updated[index][field] = value;
    setBanners(updated);
  };

  /* ---------------- DELETE OLD IMAGE ---------------- */

  const deleteOldImage = async (id) => {
    const confirm = await Swal.fire({
      title: "Delete image?",
      icon: "warning",
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    await axios.delete(
      process.env.NEXT_PUBLIC_BACKEND_URL + "api/banners/" + id,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setExistingImages(existingImages.filter(img => img.id !== id));
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = new FormData();
    payload.append("type", "hero");

    // new images
    banners.forEach((banner, index) => {
      if (banner.image) {
        payload.append(`banners[${index}][image]`, banner.image);
        if (banner.link)
          payload.append(`banners[${index}][link]`, banner.link);
      }
    });

    try {

      if (bannerId) {
        // UPDATE
        payload.append("_method", "PUT");

        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/banners/${bannerId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Updated!", "Banner updated successfully", "success");

      } else {
        // CREATE
        await axios.post(
          process.env.NEXT_PUBLIC_BACKEND_URL + "api/banners",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Created!", "Banner created successfully", "success");
      }

      router.refresh();
      router.push("/dashboard/banners");

    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <h3 className="text-center mt-5">Loading...</h3>;

  /* ---------------- UI ---------------- */

  return (
    <div className="container py-5">

      <div className="card shadow-lg p-4">

        <h4 className="mb-4 text-center">
          {bannerId ? "Update Hero Banner" : "Create Hero Banner"}
        </h4>

        {/* EXISTING IMAGES */}
        {existingImages.length > 0 && (
          <>
            <h5 className="mb-3">Existing Images</h5>
            <div className="row mb-4">
              {existingImages.map((img) => (
                <div className="col-md-4 mb-3" key={img.id}>
                  <div className="border p-2 text-center">
                    <img
                      src={
                        process.env.NEXT_PUBLIC_BACKEND_URL +
                        "storage/" +
                        img.path
                      }
                      className="img-fluid mb-2"
                    />
                    <p className="small">{img.link}</p>

                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteOldImage(img.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* NEW IMAGES */}
        <form onSubmit={handleSubmit}>
          {banners.map((banner, index) => (
            <div key={index} className="border p-3 mb-3 rounded">

              <div className="mb-2">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) =>
                    handleBannerChange(index, "image", e.target.files[0])
                  }
                />
              </div>

              <div>
                <label>Link</label>
                <input
                  type="text"
                  className="form-control"
                  value={banner.link}
                  onChange={(e) =>
                    handleBannerChange(index, "link", e.target.value)
                  }
                />
              </div>

            </div>
          ))}

          <button
            type="button"
            className="btn btn-secondary mb-3"
            onClick={addBannerField}
          >
            + Add More
          </button>

          <div className="text-center">
            <button className="btn btn-primary" disabled={loading}>
              {loading
                ? "Saving..."
                : bannerId
                ? "Update Banner"
                : "Create Banner"}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}