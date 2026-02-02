import React from 'react'
import { FaChevronDown, FaChevronUp, FaTags } from 'react-icons/fa';
import Select from "react-select";

export default function Categories({
    toggleSection,
    expandedSections,
    formData,
    setFormData,
    categories, 
}) {
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
                    <div className="d-flex align-items-center">
                        <span className="badge bg-secondary me-2">{formData.categories.length}</span>
                        {expandedSections.categories ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>
            </div>
            <div className={`collapse ${expandedSections.categories ? 'show' : ''}`}>
                <div className="card-body pt-0">
                    <label className="form-label fw-semibold text-gray-700">
                        Select Categories <span className="text-danger">*</span>
                    </label>
                    <Select
                        isMulti
                        isSearchable
                        options={options}
                        value={selectedOptions}
                        onChange={(selectedOptions) => {
                            setFormData((s) => ({
                                ...s,
                                categories: selectedOptions ? selectedOptions.map((opt) => ({
                                    category_id: opt.value,
                                })) : [],
                            }));
                        }}
                        placeholder="Search and select categories..."
                        classNamePrefix="react-select"
                        styles={{
                            control: (base) => ({
                                ...base,
                                borderColor: "#d1d3e2",
                                minHeight: "38px",
                            }),
                            menu: (base) => ({
                                ...base,
                                zIndex: 9999,
                            }),
                        }}
                    />

                    <div className="d-flex justify-content-between align-items-center mt-2">
                        <small className="text-muted">
                            Hold Ctrl/Cmd to select multiple | Type to search
                        </small>
                        <span className="badge bg-primary">
                            {formData.categories.length} selected
                        </span>
                    </div>
                    
                    {formData.categories.length === 0 && (
                        <div className="alert alert-warning mt-3 mb-0" role="alert">
                            <small>
                                <strong>Note:</strong> Please select at least one category for this product.
                            </small>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}