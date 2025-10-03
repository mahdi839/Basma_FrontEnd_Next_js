"use client";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Button from "@/app/components/dashboard/components/button/Button";
import { toast } from "react-toastify";

export default function ProductUploadForm() {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    video_url: "",
    description: "",
    discount: "",
    price: "",          // base price (single)
    images: [],
    variants: [],       // [{attribute, value, price?}]
    faqs: [],
    categories: [],
  });

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${baseUrl}api/frontend/categories`);
        setCategories(res.data);
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, []);

  // Derived flags for disabling behavior
  const hasBasePrice = useMemo(() => formData.price !== "" && formData.price !== null, [formData.price]);
  const variantPriceFilled = useMemo(
    () => formData.variants.some(v => v.price !== "" && v.price !== null && v.price !== undefined),
    [formData.variants]
  );

  // Handlers
  const handleVariantChange = (index, field, value) => {
    const next = [...formData.variants];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, variants: next }));
  };

  const handleFAQChange = (index, field, value) => {
    const next = [...formData.faqs];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, faqs: next }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((s) => ({ ...s, images: files }));
    }
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("sub_title", formData.sub_title);
    data.append("video_url", formData.video_url);
    data.append("description", formData.description);
    data.append("discount", formData.discount);

    // Base price is allowed alongside variants.
    // If base price is provided, we send it.
    if (hasBasePrice) {
      data.append("price", formData.price);
    }

    // Always send variants (attribute/value). Only send variant price if NOT disabled.
    formData.variants.forEach((v, i) => {
      data.append(`variants[${i}][attribute]`, v.attribute);
      data.append(`variants[${i}][value]`, v.value);
      if (!hasBasePrice && v.price !== "" && v.price !== null && v.price !== undefined) {
        data.append(`variants[${i}][price]`, v.price);
      }
    });

    formData.images.forEach((image) => data.append("image[]", image));

    formData.categories.forEach((category, i) => {
      data.append(`categories[${i}][category_id]`, category.category_id);
    });

    const validFAQs = formData.faqs.filter(
      (f) => f.question?.trim() !== "" && f.answer?.trim() !== ""
    );
    validFAQs.forEach((faq, i) => {
      data.append(`question[${i}]`, faq.question);
      data.append(`answer[${i}]`, faq.answer);
    });

    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      await axios.post(`${baseUrl}api/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // reset
      setFormData({
        title: "",
        sub_title: "",
        video_url: "",
        description: "",
        discount: "",
        price: "",
        images: [],
        variants: [],
        faqs: [],
        categories: [],
      });
      toast.success("Product Successfully Uploaded");
      window.location.href = "/dashboard/products";
    } catch (error) {
      toast.error(error.response?.data?.message || "An Error Occured");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Create New Product</h3>
      <form onSubmit={handleSubmit}>
        {/* Basic */}
        <div className="card mb-4">
          <div className="card-header">Basic Information</div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Sub Title <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={formData.sub_title}
                  onChange={(e) => setFormData({ ...formData, sub_title: e.target.value })}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing (Base + Variants, with mutual disabling) */}
        <div className="card mb-4">
          <div className="card-header">Pricing</div>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Base Price (optional)</label>
                <input
                  type="number"
                  className="form-control"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  // Disable base price if any variant price is filled
                  disabled={variantPriceFilled}
                  placeholder={variantPriceFilled ? "Disabled (variant prices present)" : "Enter base price"}
                />
                {variantPriceFilled && (
                  <small className="text-muted">Clear variant prices to edit base price.</small>
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="mb-0">Variants</h6>
                <Button
                  type="button"
                  className="btn"
                  onClick={() =>
                    setFormData((s) => ({
                      ...s,
                      variants: [...s.variants, { attribute: "", value: "", price: "" }],
                    }))
                  }
                >
                  Add Variant
                </Button>
              </div>

              {formData.variants.map((v, index) => (
                <div key={index} className="row g-3 mb-3">
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Attribute (e.g., size, weight, color)"
                      value={v.attribute || ""}
                      onChange={(e) => handleVariantChange(index, "attribute", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Value (e.g., M, 1kg, Red)"
                      value={v.value || ""}
                      onChange={(e) => handleVariantChange(index, "value", e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <input
                      type="number"
                      className="form-control"
                      placeholder={hasBasePrice ? "Disabled (base price present)" : "Variant price (optional)"}
                      value={v.price ?? ""}
                      onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                      // Disable variant price if base price is present
                      disabled={hasBasePrice}
                    />
                    {hasBasePrice && (
                      <small className="text-muted">Clear base price to set per-variant prices.</small>
                    )}
                  </div>
                  <div className="col-md-1">
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => {
                        const next = formData.variants.filter((_, i) => i !== index);
                        setFormData((s) => ({ ...s, variants: next }));
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="card mb-4">
          <div className="card-header">Media</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">
                Product Images <span className="text-danger">*</span>
              </label>
              <input
                type="file"
                className="form-control"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              <div className="mt-2">
                {formData.images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="img-thumbnail me-2"
                    style={{ width: "100px", height: "100px" }}
                  />
                ))}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Video URL</label>
              <input
                type="url"
                className="form-control"
                value={formData.video_url}
                onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="card mb-4">
          <div className="card-header">FAQs</div>
          <div className="card-body">
            {formData.faqs.map((faq, index) => (
              <div key={index} className="row g-3 mb-3">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Question"
                    value={faq.question}
                    onChange={(e) => handleFAQChange(index, "question", e.target.value)}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Answer"
                    value={faq.answer}
                    onChange={(e) => handleFAQChange(index, "answer", e.target.value)}
                  />
                </div>
                <div className="col-md-2">
                  <Button
                    type="button"
                    className="btn"
                    onClick={() => {
                      const next = formData.faqs.filter((_, i) => i !== index);
                      setFormData((s) => ({ ...s, faqs: next }));
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              className="btn"
              onClick={() =>
                setFormData((s) => ({
                  ...s,
                  faqs: [...s.faqs, { question: "", answer: "" }],
                }))
              }
            >
              Add FAQ
            </Button>
          </div>
        </div>

        {/* Categories */}
        <div className="card mb-4">
          <div className="card-header">Categories</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">
                Select Categories (Ctrl + click for multiple)
                <span className="text-danger">*</span>
              </label>
              <select
                multiple
                className="form-select"
                value={formData.categories.map((c) => c.category_id)}
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, (o) => o.value);
                  setFormData((s) => ({
                    ...s,
                    categories: selectedIds.map((category_id) => ({ category_id })),
                  }));
                }}
                required
              >
                <option value="">Choose a category</option>
                {categories?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="d-grid gap-2">
          <Button type="submit" className="btn btn-lg my-3">
            Create Product
          </Button>
        </div>
      </form>
    </div>
  );
}
