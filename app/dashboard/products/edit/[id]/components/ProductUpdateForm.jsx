"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaChevronDown, FaChevronUp, FaImage, FaPalette, FaRuler, FaTags, FaQuestionCircle } from "react-icons/fa";
import CreateCategory from "./updateFormComponents/CreateCategory";
import CreateSize from "./updateFormComponents/CreateSize";
import './productEdit.css';
import SizesPricing from "./updateFormComponents/SizesPricing";
import ProductImages from "./updateFormComponents/ProductImages";
import Categories from "./updateFormComponents/Categories";
import Faq from "./updateFormComponents/Faq";
import SubmitButtonDiv from "./updateFormComponents/SubmitButtonDiv";
import Colors from "./updateFormComponents/Colors";
import BasicInfo from "./updateFormComponents/BasicInfo";
import { useRouter } from "next/navigation";
export default function ProductUpdateForm({
  isEditMode = false,
  initialData = null,
  categoryData = [],
  productId = null,
}) {
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
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
    sizes: [],
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

  useEffect(() => {
    if (isEditMode && initialData) {
      // Transform initial data to match backend structure
      const transformedData = {
        title: initialData.title || "",
        short_description: initialData.short_description || "",
        video_url: initialData.video_url || "",
        description: initialData.description || "",
        discount: initialData.discount || "",
        status: initialData.status || "in-stock",
        price: initialData.price || "",
        images: [],
        colors: Array.isArray(initialData.colors)
          ? initialData.colors.map(color => ({
            id: color.id,
            code: color.code || "#000000",
            name: color.name || "",
            image: null,
            existing_image: color.image
          }))
          : (initialData.colors ? JSON.parse(initialData.colors) : []),
        sizes: initialData.sizes?.map(size => ({
          id: size.pivot?.id,
          size_id: size.id,
          price: size.pivot?.price || "",
          stock: size.pivot?.stock || 0
        })) || [],
        faqs: initialData.faqs?.map(faq => ({
          id: faq.id,
          question: faq.question || "",
          answer: faq.answer || ""
        })) || [],
        categories: initialData.category?.map(cat => ({
          category_id: cat.id
        })) || [],
      };

      console.log("Transformed Data:", transformedData);
      setFormData(transformedData);
      setExistingImages(initialData.images || []);
    }
    setCategories(categoryData?.data || categoryData || []);
  }, [isEditMode, initialData, categoryData]);

  const fetchData = async () => {
    try {
      const [catRes, sizeRes] = await Promise.all([
        axios.get(`${baseUrl}api/frontend/categories`),
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
    const next = [...formData.sizes];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, sizes: next }));
  };

  const selectedSizeIds = formData.sizes
  .map((item, i) => item.size_id)
  .filter((id, i2) => id !== "" && id !== null);


  const handleFAQChange = (index, field, value) => {
    const next = [...formData.faqs];
    next[index] = { ...next[index], [field]: value };
    setFormData((s) => ({ ...s, faqs: next }));
  };

  const handleImageUpload = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setFormData((s) => ({ ...s, images: [...s.images, ...files] }));
    }
  };

  const handleColorImageUpload = (index, e) => {
    if (e.target.files && e.target.files[0]) {
      handleColorChange(index, "image", e.target.files[0]);
    }
  };

  const handleDeleteExistingImage = (imageId) => {
    setExistingImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleDeleteColorImage = (index) => {
    handleColorChange(index, "image", null);
    handleColorChange(index, "existing_image", null);
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

    if (formData.price) {
      data.append("price", formData.price);
    }

    if (isEditMode) {
      data.append("_method", "PUT");
    }

    // Colors with images
    formData.colors.forEach((color, i) => {
      data.append(`colors[${i}][code]`, color.code);
      if (color.name) {
        data.append(`colors[${i}][name]`, color.name);
      }
      if (color.image) {
        data.append(`colors[${i}][image]`, color.image);
      } else if (color.existing_image) {
        data.append(`colors[${i}][existing_image]`, color.existing_image);
      }
    });

    // Sizes with pricing
    formData.sizes.forEach((size, i) => {
      data.append(`sizes[${i}][size_id]`, size.size_id);
      data.append(`sizes[${i}][price]`, size.price);
      data.append(`sizes[${i}][stock]`, size.stock);
    });

    // Product images
    formData.images.forEach((image) => data.append("image[]", image));

    // Delete removed existing images
    const initialImageIds = initialData?.images?.map(img => img.id) || [];
    const currentImageIds = existingImages.map(img => img.id);
    const deletedImages = initialImageIds.filter(id => !currentImageIds.includes(id));

    deletedImages.forEach(imgId => {
      data.append("deleted_images[]", imgId);
    });

    // Categories
    formData.categories.forEach((category, i) => {
      data.append(`categories[${i}][category_id]`, category.category_id);
    });

    // FAQs
    const validFAQs = formData.faqs.filter(
      (f) => f.question?.trim() !== "" && f.answer?.trim() !== ""
    );
    validFAQs.forEach((faq, i) => {
      data.append(`faqs[${i}][question]`, faq.question);
      data.append(`faqs[${i}][answer]`, faq.answer);
    });

    let token = null;
    if (typeof window !== "undefined") token = localStorage.getItem("token");

    try {
      const url = isEditMode
        ? `${baseUrl}api/products/${productId}`
        : `${baseUrl}api/products`;
      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });


      if (!isEditMode) {
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
          sizes: [],
          faqs: [],
          categories: [],
        });
      }

      toast.success(`Product ${isEditMode ? 'Updated' : 'Created'} Successfully`);
      router.push('/dashboard/products')
    } catch (error) {
      console.error("Error:", error.response?.data);
      toast.error(error.response?.data?.message || "An Error Occurred");
    }
  };

  return (
    <div className="container-fluid mt-4">
      <div className="row">
        {/* Main Form - Left Side */}
        <div className="col-lg-8">
          <div className="d-flex align-items-center mb-4">

          </div>

          <form onSubmit={handleSubmit} className="product-form">
            {/* Basic Information */}
            <BasicInfo
              toggleSection ={toggleSection}
              formData ={formData}
              setFormData ={setFormData}
              expandedSections ={expandedSections}
            />

            {/* Colors */}
            <Colors
              toggleSection={toggleSection}
              formData={formData}
              expandedSections={expandedSections}
              setFormData={setFormData}
              handleColorChange={handleColorChange}
              handleColorImageUpload={handleColorImageUpload}
              baseUrl={baseUrl}
              handleDeleteColorImage={handleDeleteColorImage}
            />

            {/* Sizes & Pricing */}

            <SizesPricing
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              formData={formData}
              sizes={sizes}
              handleSizeChange={handleSizeChange}
              setFormData={setFormData}
              selectedSizeIds={selectedSizeIds}
            />

            {/* Product Images */}
            <ProductImages
              handleDeleteExistingImage={handleDeleteExistingImage}
              toggleSection={toggleSection}
              existingImages={existingImages}
              isEditMode={isEditMode}
              handleImageUpload={handleImageUpload}
              formData={formData}
              setFormData={setFormData}
              expandedSections={expandedSections}
              baseUrl={baseUrl}
            />

            {/* Categories */}

            <Categories
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              formData={formData}
              setFormData={setFormData}
              categories={categories}
            />

            {/* FAQs */}
            <Faq
              toggleSection={toggleSection}
              expandedSections={expandedSections}
              formData={formData}
              handleFAQChange={handleFAQChange}
              setFormData={setFormData}
            />

            <SubmitButtonDiv
              isEditMode={isEditMode}
            />
          </form>
        </div>

        {/* Sidebar - Right Side */}
        <div className="col-lg-4">
          {/* Create Size */}
          <CreateSize
            sizes={sizes}
            handleCreateSize={handleCreateSize}
            newSize={newSize}
            loadingSidebar={loadingSidebar}
            setNewSize={setNewSize}
          />

          {/* Create Category */}
          <CreateCategory
            setNewCategory={setNewCategory}
            newCategory={newCategory}
            loadingSidebar={loadingSidebar}
            categories={categories}
            handleCreateCategory={handleCreateCategory}
          />
        </div>
      </div>
    </div>
  );
}