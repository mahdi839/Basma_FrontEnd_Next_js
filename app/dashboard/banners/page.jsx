"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Page() {

  const router = useRouter();

  const [bannerId, setBannerId] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [editedLinks, setEditedLinks] = useState({});
  const [banners, setBanners] = useState([{ image: null, link: "" }]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const token = typeof window !== "undefined"
    ? localStorage.getItem("token")
    : null;

  /* ================= FETCH HERO ================= */

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

    } finally {
      setPageLoading(false);
    }
  };

  /* ================= ADD FIELD ================= */

  const addBannerField = () => {
    setBanners([...banners, { image: null, link: "" }]);
  };

  const handleBannerChange = (index, field, value) => {
    const updated = [...banners];
    updated[index][field] = value;
    setBanners(updated);
  };

  /* ================= DELETE IMAGE ================= */

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

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const payload = new FormData();

    /* --- NEW IMAGES --- */
    banners.forEach((banner, index) => {
      if (banner.image) {
        payload.append(`banners[${index}][image]`, banner.image);
        payload.append(`banners[${index}][link]`, banner.link || "");
      }
    });

    /* --- EDIT EXISTING LINKS --- */
    Object.keys(editedLinks).forEach((id, index) => {
      payload.append(`image_links[${index}][id]`, id);
      payload.append(`image_links[${index}][link]`, editedLinks[id]);
    });

    try {

      if (bannerId) {
        payload.append("_method", "PUT");

        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}api/banners/${bannerId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire("Updated!", "Banner updated successfully", "success");

      } else {

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
    }

    setLoading(false);
  };

  if (pageLoading) return <h3 className="text-center mt-5">Loading...</h3>;

  /* ================= UI ================= */

  return (
    <div className="container py-5">
      <div className="card shadow-lg p-4">

        <h4 className="mb-4 text-center">
          {bannerId ? "Update Hero Banner" : "Create Hero Banner"}
        </h4>

        {/* Existing Images */}
        {existingImages.length > 0 && (
          <div className="row mb-4">
            {existingImages.map(img => (
              <div className="col-md-4 mb-3" key={img.id}>
                <div className="border p-2 text-center">

                  <img
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}storage/${img.path}`}
                    className="img-fluid mb-2"
                  />

                  <input
                    className="form-control mb-2"
                    placeholder="Edit link"
                    value={editedLinks[img.id] ?? img.link ?? ""}
                    onChange={(e) =>
                      setEditedLinks({
                        ...editedLinks,
                        [img.id]: e.target.value
                      })
                    }
                  />

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
        )}

        {/* New Images */}
        <form onSubmit={handleSubmit}>

          {banners.map((banner, index) => (
            <div key={index} className="border p-3 mb-3 rounded">

              <input
                type="file"
                className="form-control mb-2"
                onChange={(e) =>
                  handleBannerChange(index, "image", e.target.files[0])
                }
              />

              <input
                type="text"
                className="form-control"
                placeholder="Banner Link"
                value={banner.link}
                onChange={(e) =>
                  handleBannerChange(index, "link", e.target.value)
                }
              />

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
              {loading ? "Saving..." : bannerId ? "Update Banner" : "Create Banner"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}