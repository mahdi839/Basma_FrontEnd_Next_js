"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/app/components/dashboard/components/button/Button";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp, FaImage, FaPalette, FaRuler, FaTags, FaQuestionCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function ProductUploadForm() {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    video_url: "",
    description: "",
    discount: "",
    status: "in-stock",
    price: "",
    images: [],
    colors: [],
    productSizes: [],
    faqs: [],
    categories: [],
  });

  // Sidebar states
  const [newSize, setNewSize] = useState("");
  const [newCategory, setNewCategory] = useState({
    name: "",
    home_category: "0",
    priority: 0,
  });
  const [loadingSidebar, setLoadingSidebar] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    colors: false,
    sizes: false,
    images: false,
    categories: false,
    faqs: false
  });

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, sizeRes] = await Promise.all([
        axios.get(`${baseUrl}api/product_add_category`),
        axios.get(`${baseUrl}api/sizes`),
      ]);
      setCategories(catRes.data);
      setSizes(sizeRes.data);
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Create new size
  const handleCreateSize = async (e) => {
    e.preventDefault();
    if (!newSize.trim()) {
      toast.error("Size name is required");
      return;
    }

    setLoadingSidebar(true);
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${baseUrl}api/sizes`,
        { size: newSize },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSizes([res.data, ...sizes]);
      setNewSize("");
      toast.success("Size created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create size");
    } finally {
      setLoadingSidebar(false);
    }
  };

  // Create new category
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoadingSidebar(true);
    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        `${baseUrl}api/categories`,
        newCategory,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCategories([res.data, ...categories]);
      setNewCategory({ name: "", home_category: "0", priority: 0 });
      toast.success("Category created successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoadingSidebar(false);
    }
  };

  // Handlers
  const handleColorChange = (index, field, value) => {
    const next = [...formData.colors];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, colors: next }));
  };

  const handleSizeChange = (index, field, value) => {
    const next = [...formData.productSizes];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, productSizes: next }));
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

  const handleColorImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      handleColorChange(index, "image", e.target.files[0]);
    }
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("short_description", formData.short_description);
    data.append("video_url", formData.video_url);
    data.append("description", formData.description);
    data.append("discount", formData.discount);
    data.append("status", formData.status);
    data.append("price", formData.price || "");

    // Colors with images
    formData.colors.forEach((color, i) => {
      data.append(`colors[${i}][code]`, color.code);
      data.append(`colors[${i}][name]`, color.name || "");
      if (color.image) {
        data.append(`colors[${i}][image]`, color.image);
      }
    });

    // Sizes with pricing
    formData.productSizes.forEach((size, i) => {
      data.append(`sizes[${i}][size_id]`, size.size_id);
      data.append(`sizes[${i}][price]`, size.price);
      data.append(`sizes[${i}][stock]`, size.stock);
    });

    // Product images
    formData.images.forEach((image) => data.append("image[]", image));

    // Categories
    formData.categories.forEach((category, i) => {
      data.append(`categories[${i}][category_id]`, category.category_id);
    });

    // FAQs
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
        short_description: "",
        video_url: "",
        description: "",
        discount: "",
        status: "in-stock",
        price: "",
        images: [],
        colors: [],
        productSizes: [],
        faqs: [],
        categories: [],
      });
      toast.success("Product Successfully Uploaded");
      router.push('/dashboard/products')
    } catch (error) {
      toast.error(error.response?.data?.message || "An Error Occurred");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Main Form - Left Side */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-4">
            <h3 className="mb-0 fw-bold text-gray-800">Create New Product</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="product-form">
            {/* Basic Information */}
            <div className="card mb-4 border-0 shadow-sm">
              <div 
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('basic')}
              >
                <div className="d-flex align-items-center justify-content-between ">
                  <div className="d-flex align-items-center">
                    <div className="pr-2">
                      <FaTags size={22} className="text-primary" />
                    </div>
                    <h4 className="mb-0 fw-semibold text-dark ">Basic Information</h4>
                  </div>
                  {expandedSections.basic ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              <div className={`collapse ${expandedSections.basic ? 'show' : ''}`}>
                <div className="card-body pt-0">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-700">
                        Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control border-gray-300 focus-border-primary"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        placeholder="Enter product title"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-700">
                        Short Description <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control border-gray-300 focus-border-primary"
                        required
                        value={formData.short_description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            short_description: e.target.value,
                          })
                        }
                        placeholder="Brief description of the product"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-700">
                        Status <span className="text-danger">*</span>
                      </label>
                      <select
                        className="form-select border-gray-300 focus-border-primary"
                        required
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="in-stock" className="text-success">In Stock</option>
                        <option value="sold" className="text-danger">Sold</option>
                        <option value="prebook" className="text-warning">Pre-book</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-700">Single Price</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-gray-300">৳</span>
                        <input
                          type="number"
                          className="form-control border-gray-300 focus-border-primary"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          placeholder="Optional base price"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-700">Discount</label>
                      <input
                        type="text"
                        className="form-control border-gray-300 focus-border-primary"
                        value={formData.discount}
                        onChange={(e) =>
                          setFormData({ ...formData, discount: e.target.value })
                        }
                        placeholder="e.g., 10% or 100 BDT"
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-gray-700">Video URL</label>
                      <input
                        type="url"
                        className="form-control border-gray-300 focus-border-primary"
                        value={formData.video_url}
                        onChange={(e) =>
                          setFormData({ ...formData, video_url: e.target.value })
                        }
                        placeholder="https://example.com/video"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-semibold text-gray-700">Description</label>
                      <textarea
                        className="form-control border-gray-300 focus-border-primary"
                        rows={5}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        placeholder="Detailed product description..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="card mb-4 border-0 shadow-sm">
              <div 
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('colors')}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className=" bg-opacity-10 p-2 rounded me-3">
                      <FaPalette size={22} className="text-success" />
                    </div>
                    <h5 className="mb-0 fw-semibold text-dark">Colors & Variants</h5>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-success me-2">{formData.colors.length}</span>
                    {expandedSections.colors ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>
              <div className={`collapse ${expandedSections.colors ? 'show' : ''}`}>
                <div className="card-body pt-0">
                  {formData.colors.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <FaPalette className="fs-1 mb-2 opacity-50" />
                      <p className="mb-3">No colors added yet</p>
                    </div>
                  ) : (
                    formData.colors.map((color, index) => (
                      <div key={index} className="row g-3 mb-3 p-3 border rounded bg-light align-items-end">
                        <div className="col-md-7">
                          <label className="form-label fw-semibold text-gray-700">Color Image</label>
                          <div className="input-group">
                            <input
                              type="file"
                              className="form-control border-gray-300"
                              accept="image/*"
                              onChange={(e) => handleColorImageUpload(index, e)}
                            />
                          </div>
                          {color.image && (
                            <small className="text-success d-block mt-1">
                              ✓ {color.image.name}
                            </small>
                          )}
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger w-100"
                            onClick={() => {
                              const next = formData.colors.filter(
                                (_, i) => i !== index
                              );
                              setFormData((s) => ({ ...s, colors: next }));
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={() =>
                        setFormData((s) => ({
                          ...s,
                          colors: [...s.colors, { code: "#000000", image: null }],
                        }))
                      }
                    >
                      <FaPlus className="me-2" /> Add Color Variant
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Sizes & Pricing */}
            <div className="card mb-4 border-0 shadow-sm">
              <div 
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('sizes')}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className=" bg-opacity-10 p-2 rounded me-3">
                      <FaRuler size={22} className="text-warning" />
                    </div>
                    <h5 className="mb-0 fw-semibold text-dark">Sizes & Pricing</h5>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-warning me-2">{formData.productSizes.length}</span>
                    {expandedSections.sizes ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>
              <div className={`collapse ${expandedSections.sizes ? 'show' : ''}`}>
                <div className="card-body pt-0">
                  {formData.productSizes.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <FaRuler className="fs-1 mb-2 opacity-50" />
                      <p className="mb-3">No sizes added yet</p>
                    </div>
                  ) : (
                    formData.productSizes.map((size, index) => (
                      <div key={index} className="row g-3 mb-3 p-3 border rounded bg-light">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold text-gray-700">Size</label>
                          <select
                            className="form-select border-gray-300"
                            value={size.size_id || ""}
                            onChange={(e) =>
                              handleSizeChange(index, "size_id", e.target.value)
                            }
                            
                          >
                            <option value="">Select Size</option>
                            {sizes.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.size}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-gray-700">Price</label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-gray-300">৳</span>
                            <input
                              type="number"
                              className="form-control border-gray-300"
                              placeholder="1500"
                              value={size.price || ""}
                              onChange={(e) =>
                                handleSizeChange(index, "price", e.target.value)
                              }
                              
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-semibold text-gray-700">Stock</label>
                          <input
                            type="number"
                            className="form-control border-gray-300"
                            placeholder="10"
                            value={size.stock || ""}
                            onChange={(e) =>
                              handleSizeChange(index, "stock", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger w-100"
                            onClick={() => {
                              const next = formData.productSizes.filter(
                                (_, i) => i !== index
                              );
                              setFormData((s) => ({ ...s, productSizes: next }));
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      onClick={() =>
                        setFormData((s) => ({
                          ...s,
                          productSizes: [
                            ...s.productSizes,
                            { size_id: "", price: "", stock: 0 },
                          ],
                        }))
                      }
                    >
                      <FaPlus className="me-2" /> Add Size Variant
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="card mb-4 border-0 shadow-sm">
              <div 
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('images')}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className=" bg-opacity-10 p-2 rounded me-3">
                      <FaImage size={22} className="text-info" />
                    </div>
                    <h5 className="mb-0 fw-semibold text-dark">Product Images</h5>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-info me-2">{formData.images.length}</span>
                    {expandedSections.images ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>
              <div className={`collapse ${expandedSections.images ? 'show' : ''}`}>
                <div className="card-body pt-0">
                  <label className="form-label fw-semibold text-gray-700">
                    Upload Images <span className="text-danger">*</span>
                  </label>
                  <div className="border-dashed rounded p-4 text-center bg-light">
                    <FaImage className="fs-1 text-muted mb-3" />
                    <input
                      type="file"
                      className="form-control d-none"
                      id="imageUpload"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      required
                    />
                    <label htmlFor="imageUpload" className="btn btn-outline-primary cursor-pointer">
                      Choose Files
                    </label>
                    <p className="text-muted mt-2 mb-0">PNG, JPG, JPEG files up to 10MB</p>
                  </div>
                  
                  {formData.images.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fw-semibold mb-3">Selected Images ({formData.images.length})</h6>
                      <div className="row g-2">
                        {formData.images.map((image, index) => (
                          <div key={index} className="col-6 col-md-3">
                            <div className="position-relative">
                              <img
                                src={URL.createObjectURL(image)}
                                alt="Preview"
                                className="img-thumbnail w-100"
                                style={{ height: "120px", objectFit: "cover" }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                onClick={() => {
                                  const next = formData.images.filter((_, i) => i !== index);
                                  setFormData((s) => ({ ...s, images: next }));
                                }}
                              >
                                <FaTrash size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="card mb-4 border-0 shadow-sm">
              <div 
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('categories')}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="bg-opacity-10 p-2 rounded me-3">
                      <FaTags size={22} className="text-secondary" />
                    </div>
                    <h5 className="mb-0 fw-semibold text-dark">Categories</h5>
                  </div>
                  {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
                </div>
              </div>
              <div className={`collapse ${expandedSections.categories ? 'show' : ''}`}>
                <div className="card-body pt-0">
                  <label className="form-label fw-semibold text-gray-700">
                    Select Categories <span className="text-danger">*</span>
                  </label>
                  <select
                    multiple
                    className="form-select border-gray-300"
                    size="6"
                    value={formData.categories.map((c) => c.category_id)}
                    onChange={(e) => {
                      const selectedIds = Array.from(
                        e.target.selectedOptions,
                        (o) => o.value
                      );
                      setFormData((s) => ({
                        ...s,
                        categories: selectedIds.map((category_id) => ({
                          category_id,
                        })),
                      }));
                    }}
                    required
                  >
                    {categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                    <span className="badge bg-primary">{formData.categories.length} selected</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className="card mb-4 border-0 shadow-sm">
              <div 
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('faqs')}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="bg-opacity-10 p-2 rounded me-3">
                      <FaQuestionCircle size={22} className="text-dark" />
                    </div>
                    <h5 className="mb-0 fw-semibold text-dark">Frequently Asked Questions</h5>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="badge bg-dark me-2">{formData.faqs.length}</span>
                    {expandedSections.faqs ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                </div>
              </div>
              <div className={`collapse ${expandedSections.faqs ? 'show' : ''}`}>
                <div className="card-body pt-0">
                  {formData.faqs.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <FaQuestionCircle className="fs-1 mb-2 opacity-50" />
                      <p className="mb-3">No FAQs added yet</p>
                    </div>
                  ) : (
                    formData.faqs.map((faq, index) => (
                      <div key={index} className="row g-3 mb-3 p-3 border rounded bg-light">
                        <div className="col-md-5">
                          <label className="form-label fw-semibold text-gray-700">Question</label>
                          <input
                            type="text"
                            className="form-control border-gray-300"
                            placeholder="Enter question"
                            value={faq.question}
                            onChange={(e) =>
                              handleFAQChange(index, "question", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label fw-semibold text-gray-700">Answer</label>
                          <input
                            type="text"
                            className="form-control border-gray-300"
                            placeholder="Enter answer"
                            value={faq.answer}
                            onChange={(e) =>
                              handleFAQChange(index, "answer", e.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-1 d-flex align-items-end">
                          <button
                            type="button"
                            className="btn btn-outline-danger w-100"
                            onClick={() => {
                              const next = formData.faqs.filter(
                                (_, i) => i !== index
                              );
                              setFormData((s) => ({ ...s, faqs: next }));
                            }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                  
                  <div className="text-center mt-3">
                    <button
                      type="button"
                      className="btn btn-outline-dark"
                      onClick={() =>
                        setFormData((s) => ({
                          ...s,
                          faqs: [...s.faqs, { question: "", answer: "" }],
                        }))
                      }
                    >
                      <FaPlus className="me-2" /> Add FAQ
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm  bg-opacity-5">
              <div className="card-body py-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h6 className="fw-semibold mb-1">Ready to publish your product?</h6>
                    <p className="text-muted mb-0">Review all information before submitting</p>
                  </div>
                  <div className="col-md-4 text-end">
                    <Button type="submit" className="btn btn-primary px-4 py-2 fw-semibold">
                      Create Product
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar - Right Side */}
        <div className="col-lg-4">
          {/* Create Size */}
          <div className="card mb-4 border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-gradient-primary text-white border-0">
              <h5 className="mb-0 fw-semibold">
                <FaRuler className="me-2" />
                Quick Create Size
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateSize}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-gray-700">Size Name</label>
                  <input
                    type="text"
                    className="form-control border-gray-300"
                    placeholder="e.g., S, M, L, XL"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-100 fw-semibold py-2"
                  disabled={loadingSidebar}
                >
                  {loadingSidebar ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Size"
                  )}
                </button>
              </form>

              <hr className="my-4" />

              <h6 className="fw-semibold mb-3 text-gray-700">Recent 6 Sizes</h6>
              <div className="d-flex flex-wrap gap-2">
                {sizes.slice(0, 6).map((size) => (
                  <span
                    key={size.id}
                    className="badge fs-6 bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2"
                  >
                    {size.size}
                  </span>
                ))}
                {sizes.length === 0 && (
                  <p className="text-muted text-center w-100">No sizes available</p>
                )}
              </div>
            </div>
          </div>

          {/* Create Category */}
          <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-gradient-success text-white border-0">
              <h5 className="mb-0 fw-semibold">
                <FaTags className="me-2" />
                Quick Create Category
              </h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleCreateCategory}>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-gray-700">Category Name</label>
                  <input
                    type="text"
                    className="form-control border-gray-300"
                    placeholder="Enter category name"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-gray-700">Home Category</label>
                  <select
                    className="form-select border-gray-300"
                    value={newCategory.home_category}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        home_category: e.target.value,
                      })
                    }
                  >
                    <option value="0">Off</option>
                    <option value="1">On</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold text-gray-700">Priority</label>
                  <input
                    type="number"
                    className="form-control border-gray-300"
                    placeholder="0"
                    value={newCategory.priority}
                    onChange={(e) =>
                      setNewCategory({
                        ...newCategory,
                        priority: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-success w-100 fw-semibold py-2"
                  disabled={loadingSidebar}
                >
                  {loadingSidebar ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Category"
                  )}
                </button>
              </form>

              <hr className="my-4" />

              <h6 className="fw-semibold mb-3 text-gray-700">Recent 5 Categories</h6>
              <div className="list-group list-group-flush">
                {categories.slice(0, 5).map((category) => (
                  <div
                    key={category.id}
                    className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2"
                  >
                    <span className="fw-medium">{category.name}</span>
                    <span
                      className={`badge ${
                        category.home_category ? "bg-info" : "bg-secondary"
                      } rounded-pill`}
                    >
                      {category.home_category ? "Home" : "Regular"}
                    </span>
                  </div>
                ))}
                {categories.length === 0 && (
                  <p className="text-muted text-center">No categories available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .border-dashed {
          border: 2px dashed #dee2e6;
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #1cc88a 0%, #13855c 100%);
        }
        .focus-border-primary:focus {
          border-color: #4e73df;
          box-shadow: 0 0 0 0.2rem rgba(78, 115, 223, 0.25);
        }
        .border-gray-300 {
          border-color: #d1d3e2 !important;
        }
      `}</style>
    </div>
  );
}