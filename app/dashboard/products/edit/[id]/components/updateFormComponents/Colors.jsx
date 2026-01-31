import React from 'react'
import { FaChevronDown, FaChevronUp, FaPalette, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';

export default function Colors({ toggleSection,
    formData,
    expandedSections,
    setFormData,
    handleColorChange,
    handleColorImageUpload,
    baseUrl,
    handleDeleteColorImage }) {
    return (
        <div className="card mb-4 border-0 shadow-sm">
            <div
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('colors')}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-opacity-10 p-2 rounded me-3">
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
                                <div className="col-md-3">
                                    <label className="form-label fw-semibold text-gray-700">Color Name</label>
                                    <input
                                        type="text"
                                        className="form-control border-gray-300"
                                        placeholder="e.g., Red, Blue, Navy"
                                        value={color.name || ""}
                                        onChange={(e) =>
                                            handleColorChange(index, "name", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-gray-700">Color Image</label>
                                    <div className="input-group">
                                        <input
                                            type="file"
                                            className="form-control border-gray-300"
                                            accept="image/*"
                                            onChange={(e) => handleColorImageUpload(index, e)}
                                        />
                                    </div>
                                    
                                    {/* Show preview for newly uploaded image */}
                                    {color.image && (
                                        <div className="mt-2 position-relative d-inline-block">
                                            <img
                                                src={URL.createObjectURL(color.image)}
                                                alt="Color preview"
                                                className="img-thumbnail"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                style={{ padding: "2px 6px", margin: "2px" }}
                                                onClick={() => handleDeleteColorImage(index)}
                                                title="Remove image"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                            <small className="text-success d-block mt-1">
                                                ✓ New: {color.image.name}
                                            </small>
                                        </div>
                                    )}
                                    
                                    {/* Show existing image if no new image uploaded */}
                                    {color.existing_image && !color.image && (
                                        <div className="mt-2 position-relative d-inline-block">
                                            <img
                                                src={`${baseUrl}${color.existing_image}`}
                                                alt="Color preview"
                                                className="img-thumbnail"
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger position-absolute top-0 end-0"
                                                style={{ padding: "2px 6px", margin: "2px" }}
                                                onClick={() => handleDeleteColorImage(index)}
                                                title="Remove existing image"
                                            >
                                                <FaTimes size={12} />
                                            </button>
                                            <small className="text-muted d-block mt-1">
                                                Current image
                                            </small>
                                        </div>
                                    )}
                                    
                                    {/* Show message when no image */}
                                    {!color.image && !color.existing_image && (
                                        <small className="text-muted d-block mt-1">
                                            No image selected
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
                                    colors: [...s.colors, { code: "#000000", name: "", image: null }],
                                }))
                            }
                        >
                            <FaPlus className="me-2" /> Add Color Variant
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}