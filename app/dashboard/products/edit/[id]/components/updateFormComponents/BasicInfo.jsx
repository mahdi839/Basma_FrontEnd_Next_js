import React from 'react'
import { FaChevronDown, FaChevronUp, FaTags } from 'react-icons/fa';

export default function BasicInfo({toggleSection,formData,setFormData,expandedSections}) {
    return (
        <div className="card mb-4 border-0 shadow-sm">
            <div
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('basic')}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="pr-2">
                            <FaTags size={22} className="text-primary" />
                        </div>
                        <h4 className="mb-0 fw-semibold text-dark">Basic Information</h4>
                    </div>
                    {expandedSections.basic ? <FaChevronUp /> : <FaChevronDown />}
                </div>
            </div>
            <div className={`collapse ${expandedSections.basic ? 'show' : ''}`}>
                <div className="card-body pt-0">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-gray-700">
                                Product Title <span className="text-danger">*</span>
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
                                Stock Status <span className="text-danger">*</span>
                            </label>
                            <select
                                className="form-select border-gray-300 focus-border-primary"
                                required
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({ ...formData, status: e.target.value })
                                }
                            >
                                <option value="in-stock">In Stock</option>
                                <option value="prebook">Pre-book</option>
                                <option value="sold">Sold Out</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-gray-700">
                                Original Price
                            </label>
                            <div className="input-group">
                                <span className="input-group-text bg-light border-gray-300">৳</span>
                                <input
                                    type="number"
                                    className="form-control border-gray-300 focus-border-primary"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({ ...formData, price: e.target.value })
                                    }
                                    placeholder="e.g., 1500"
                                    min="0"
                                />
                            </div>
                        </div>
                         <div className="col-md-6">
                            <label className="form-label fw-semibold text-gray-700">
                                Sku
                            </label>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control border-gray-300 focus-border-primary"
                                    value={formData.sku}
                                    onChange={(e) =>
                                        setFormData({ ...formData, sku: e.target.value })
                                    }
                                    placeholder="Sku"
                                    min="0"
                                />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-gray-700">
                                Discount
                                <small className="text-muted ms-1">(Optional)</small>
                            </label>
                            <input
                                type="text"
                                className="form-control border-gray-300 focus-border-primary"
                                value={formData.discount}
                                onChange={(e) =>
                                    setFormData({ ...formData, discount: e.target.value })
                                }
                                placeholder="e.g., 10% off or ৳100 off"
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-semibold text-gray-700">
                                Video URL
                                <small className="text-muted ms-1">(Optional)</small>
                            </label>
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
                            <label className="form-label fw-semibold text-gray-700">
                                Detailed Description
                                <small className="text-muted ms-1">(Optional)</small>
                            </label>
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
                                placeholder="Enter detailed product description, features, materials, care instructions, etc..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}