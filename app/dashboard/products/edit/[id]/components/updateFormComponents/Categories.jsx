import React from 'react'
import { FaChevronDown, FaChevronUp, FaTags } from 'react-icons/fa';
import Select from "react-select";

export default function Categories({
    toggleSection,
    expandedSections,
    formData,
    setFormData,
    categories, }) {
    // 1️⃣ Convert backend categories → react-select format
    const options = categories?.map((category) => ({
        value: category.id,
        label: category.name,
    })) || [];

    // 2️⃣ Convert saved form data → selected options
    const selectedOptions = options.filter((opt) =>
        formData.categories.some((c) => c.category_id == opt.value)
    );
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
                    <Select
                        isMulti
                        options={options}
                        value={selectedOptions}
                        onChange={(selectedOptions) => {
                            setFormData((s) => ({
                                ...s,
                                categories: selectedOptions.map((opt) => ({
                                    category_id: opt.value,
                                })),
                            }));
                        }}
                        placeholder="Search and select categories..."
                    />

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                        <span className="badge bg-primary">{formData.categories.length} selected</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
