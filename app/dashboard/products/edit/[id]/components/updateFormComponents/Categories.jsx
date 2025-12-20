import React from 'react'
import { FaChevronDown, FaChevronUp, FaTags } from 'react-icons/fa';


export default function Categories({
    toggleSection,
    expandedSections,
    formData,
    setFormData,
    categories,}) {
    return (
        <div className="card mb-4 border-top">
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
    )
}
