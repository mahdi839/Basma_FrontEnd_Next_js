import React from 'react'
import { FaChevronDown, FaChevronUp, FaListUl, FaTrash, FaPlus } from 'react-icons/fa';

export default function Specifications({ 
    toggleSection,
    expandedSections,
    formData,
    handleSpecificationChange,
    setFormData,
}) {
    return (
        <div className="card mb-4 border-0 shadow-sm">
            <div
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('specifications')}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-opacity-10 p-2 rounded me-3">
                            <FaListUl size={22} className="text-primary" />
                        </div>
                        <h5 className="mb-0 fw-semibold text-dark">Product Specifications</h5>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="badge bg-primary me-2">{formData.specifications.length}</span>
                        {expandedSections.specifications ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>
            </div>
            <div className={`collapse ${expandedSections.specifications ? 'show' : ''}`}>
                <div className="card-body pt-0">
                    {formData.specifications.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <FaListUl className="fs-1 mb-2 opacity-50" />
                            <p className="mb-3">No specifications added yet</p>
                            <small className="d-block text-muted">
                                Add product details like Product Code, Size, Material, etc.
                            </small>
                        </div>
                    ) : (
                        formData.specifications.map((spec, index) => (
                            <div key={index} className="row g-3 mb-3 p-3 border rounded bg-light">
                                <div className="col-md-5">
                                    <label className="form-label fw-semibold text-gray-700">
                                        Specification Name
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border-gray-300"
                                        placeholder="e.g., Product Code, Upper Material"
                                        value={spec.key || ""}
                                        onChange={(e) =>
                                            handleSpecificationChange(index, "key", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-gray-700">
                                        Value
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control border-gray-300"
                                        placeholder="e.g., WFS005, Microfiber"
                                        value={spec.value || ""}
                                        onChange={(e) =>
                                            handleSpecificationChange(index, "value", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-1 d-flex align-items-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => {
                                            const next = formData.specifications.filter(
                                                (_, i) => i !== index
                                            );
                                            setFormData((s) => ({ ...s, specifications: next }));
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
                            className="btn btn-outline-primary"
                            onClick={() =>
                                setFormData((s) => ({
                                    ...s,
                                    specifications: [...s.specifications, { key: "", value: "" }],
                                }))
                            }
                        >
                            <FaPlus className="me-2" /> Add Specification
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}