import React from 'react'
import { FaChevronDown, FaChevronUp, FaImage, FaTrash } from 'react-icons/fa';

export default function ProductImages({ handleDeleteExistingImage, toggleSection, existingImages, isEditMode, handleImageUpload, formData, setFormData, expandedSections ,baseUrl }) {
    return (
        <div className="card mb-4 border-0 shadow-sm">
            <div
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('images')}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-opacity-10 p-2 rounded me-3">
                            <FaImage size={22} className="text-info" />
                        </div>
                        <h5 className="mb-0 fw-semibold text-dark">Product Images</h5>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="badge bg-info me-2">
                            {existingImages.length + formData.images.length}
                        </span>
                        {expandedSections.images ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>
            </div>
            <div className={`collapse ${expandedSections.images ? 'show' : ''}`}>
                <div className="card-body pt-0">
                    <label className="form-label fw-semibold text-gray-700">
                        Upload Images {!isEditMode && <span className="text-danger">*</span>}
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
                            required={!isEditMode && formData.images.length === 0 && existingImages.length === 0}
                        />
                        <label htmlFor="imageUpload" className="btn btn-outline-primary cursor-pointer">
                            Choose Files
                        </label>
                        <p className="text-muted mt-2 mb-0">PNG, JPG, JPEG files up to 10MB</p>
                    </div>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mt-4">
                            <h6 className="fw-semibold mb-3">Existing Images ({existingImages.length})</h6>
                            <div className="row g-2">
                                {existingImages.map((image) => (
                                    <div key={image.id} className="col-6 col-md-3">
                                        <div className="position-relative">
                                            <img
                                                src={`${baseUrl}${image.image}`}
                                                alt="Existing product"
                                                className="img-thumbnail w-100"
                                                style={{ height: "120px", objectFit: "cover" }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1"
                                                onClick={() => handleDeleteExistingImage(image.id)}
                                            >
                                                <FaTrash size={10} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Images */}
                    {formData.images.length > 0 && (
                        <div className="mt-4">
                            <h6 className="fw-semibold mb-3">New Images ({formData.images.length})</h6>
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
    )
}
