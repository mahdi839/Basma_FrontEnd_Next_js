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
                            <label className="form-label fw-semibold text-gray-700">Original Price</label>
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
                            <label className="form-label fw-semibold text-gray-700">Discounted Price</label>
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
    )
}
