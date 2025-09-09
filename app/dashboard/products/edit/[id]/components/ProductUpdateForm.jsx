"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@/app/components/dashboard/components/button/Button';
import { toast } from 'react-toastify';

export default function ProductUpdateForm({
    isEditMode = false,
    initialData = null,
    sizesData = [],
    categoryData = [],
    productId = null
}) {
    const [sizes, setSizes] = useState(sizesData);
    const [useSinglePrice, setUseSinglePrice] = useState(true);
    const [existingImages, setExistingImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        sub_title: '',
        video_url: '',
        description: '',
        discount: '',
        price: '',
        images: [],
        sizes: [],
        faqs: [],
        categories: []
    });

    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                title: initialData.title,
                sub_title: initialData.sub_title,
                video_url: initialData.video_url,
                description: initialData.description,
                discount: initialData.discount,
                price: initialData.price,
                images: [],
                sizes: initialData.sizes?.map(size => ({
                    size_id: size.id,
                    price: size.pivot.price
                })) || [],
                faqs: initialData.faqs || [],
                categories: initialData.category?.map(cat => ({
                    category_id: cat.id // Convert to string to match select value
                })) || []
            });
            setExistingImages(initialData.images || []);
            setUseSinglePrice(!initialData.sizes?.length);
        }
        setCategories(categoryData)
    }, [isEditMode, initialData]);

    // Handlers
    const handleSizeChange = (index, field, value) => {
        const newSizes = [...formData.sizes];
        newSizes[index] = { ...newSizes[index], [field]: value };
        setFormData({ ...formData, sizes: newSizes });
    };

    const handleFAQChange = (index, field, value) => {
        const newFAQs = [...formData.faqs];
        newFAQs[index] = { ...newFAQs[index], [field]: value };
        setFormData({ ...formData, faqs: newFAQs });
    };

    const handleImageUpload = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData(prev => ({ ...prev, images: [...prev.images, ...files] }));
        }
    };

    const handleDeleteImage = (imageId) => {
        setExistingImages(existingImages.map(img =>
            img.id === imageId ? { ...img, markedForDelete: true } : img
        ));
    };

    const handleAddFAQ = () => {
        setFormData({
            ...formData,
            faqs: [...formData.faqs, { question: '', answer: '', id: null }]
        });
    };
    const token = localStorage.getItem('token');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        // Common fields
        data.append('title', formData.title);
        data.append('sub_title', formData.sub_title);
        data.append('video_url', formData.video_url);
        data.append('description', formData.description);
        data.append('discount', formData.discount);
        if (isEditMode) data.append('_method', 'PUT');

        // Pricing
        if (useSinglePrice) {
            data.append('price', formData.price);
        } else {
            formData.sizes.forEach((size, index) => {
                data.append(`sizes[${index}][size_id]`, size.size_id);
                data.append(`sizes[${index}][price]`, size.price);
            });
        }

        // Handle categories
        formData.categories.forEach((category, index) => {
            data.append(`categories[${index}][category_id]`, category.category_id);
        });

        // Images
        formData.images.forEach(image => data.append('image[]', image));
        existingImages.forEach(image => {
            if (image.markedForDelete) data.append('delete_images[]', image.id);
        });

        // FAQs
        const validFAQs = formData.faqs.filter(faq =>
            faq.question.trim() && faq.answer.trim()
        );
        validFAQs.forEach((faq, index) => {
            data.append(`faqs[${index}][question]`, faq.question);
            data.append(`faqs[${index}][answer]`, faq.answer);
            if (faq.id) data.append(`faqs[${index}][id]`, faq.id);
        });


        try {
            const url = isEditMode
                ? `${process.env.NEXT_PUBLIC_BACKEND_URL}api/products/${productId}`
                : `${process.env.NEXT_PUBLIC_BACKEND_URL}api/products`;

            await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });

            toast.success(`Product ${isEditMode ? 'Updated' : 'Created'} Successfully`);
            window.location.href = "/dashboard/products";
        } catch (error) {
            toast.error(error.response?.data?.message || "An Error Occurred");
        }
    };

    const renderImagePreviews = () => (
        <div className="mt-2">
            {existingImages.map((image) => (
                !image.markedForDelete && (
                    <div key={image.id} className="position-relative d-inline-block me-2">
                        <img
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${image.image}`}
                            alt="Existing"
                            className="img-thumbnail"
                            style={{ width: '100px', height: '100px' }}
                        />
                        <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0"
                            onClick={() => handleDeleteImage(image.id)}
                        >
                            ×
                        </button>
                    </div>
                )
            ))}

            {formData.images.map((image, index) => (
                <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="img-thumbnail me-2"
                    style={{ width: '100px', height: '100px' }}
                />
            ))}
        </div>
    );

    return (
        <div className="container mt-4">

            <form onSubmit={handleSubmit}>
                {/* Basic Information */}
                <div className="card mb-4">
                    <div className="card-header">Basic Information</div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Title <span className='text-danger'>*</span></label>
                                <input
                                    type="text"
                                    className="form-control"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Sub Title<span className='text-danger'>*</span></label>
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

                {/* Pricing */}
                <div className="card mb-4">
                    <div className="card-header">Pricing Configuration</div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Pricing Type <span className='text-danger'>*</span></label>
                            <div>
                                <Button
                                    type="button"
                                    className={`btn ${useSinglePrice ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setUseSinglePrice(true)}
                                >
                                    Single Price
                                </Button>
                                <Button
                                    type="button"
                                    className={`btn ms-2 ${!useSinglePrice ? 'btn-primary' : 'btn-secondary'}`}
                                    onClick={() => setUseSinglePrice(false)}
                                >
                                    Size-based Pricing
                                </Button>
                            </div>
                        </div>

                        {useSinglePrice ? (
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">Price <span className='text-danger'>*</span></label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="card-body">
                                {formData.sizes.map((size, index) => (
                                    <div key={index} className="row g-3 mb-3">
                                        <div className="col-md-4">
                                            <select
                                                className="form-select"
                                                value={size.size_id || ''}
                                                onChange={(e) => handleSizeChange(index, 'size_id', e.target.value)}

                                            >
                                                <option value="">Select Size</option>
                                                {sizes.map((sizeOption) => (
                                                    <option key={sizeOption.id} value={sizeOption.id}>
                                                        {sizeOption.size}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                type="number"
                                                className="form-control"
                                                placeholder="Price"
                                                value={size.price || ''}
                                                onChange={(e) => handleSizeChange(index, 'price', e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <button
                                                type="button"
                                                className="btn btn-danger"
                                                onClick={() => {
                                                    const newSizes = formData.sizes.filter((_, i) => i !== index);
                                                    setFormData({ ...formData, sizes: newSizes });
                                                }}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => setFormData({
                                        ...formData,
                                        sizes: [...formData.sizes, { size_id: '', price: '' }]
                                    })}
                                >
                                    Add Size
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Media */}
                <div className="card mb-4">
                    <div className="card-header">Media</div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Product Images<span className='text-danger'>*</span></label>
                            <input
                                type="file"
                                className="form-control"
                                multiple
                                accept="image/*"
                                onChange={handleImageUpload}
                                required={!isEditMode}
                            />
                            {renderImagePreviews()}
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
                                        onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-5">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Answer"
                                        value={faq.answer}
                                        onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                                    />
                                </div>
                                <div className="col-md-2">
                                    <Button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => {
                                            const newFAQs = formData.faqs.filter((_, i) => i !== index);
                                            setFormData({ ...formData, faqs: newFAQs });
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                        <Button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleAddFAQ}
                        >
                            Add FAQ
                        </Button>
                    </div>
                </div>

                {/* categories */}
                <div className="card mb-4">
                    <div className="card-header">Categories</div>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label">Select Categories (Ctrl + click for multiple)<span className="text-danger">*</span></label>
                            <select
                                multiple
                                className="form-select"
                                value={formData.categories.map(c => c.category_id)}
                                onChange={(e) => {
                                    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                                    setFormData({
                                        ...formData,
                                        categories: selectedIds.map(categoryId => ({ category_id: categoryId }))
                                    });
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
                    <Button type="submit" className="btn btn-success btn-lg my-3">
                        {isEditMode ? "Update Product" : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    );
}