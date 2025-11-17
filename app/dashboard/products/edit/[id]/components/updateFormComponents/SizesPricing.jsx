import React from 'react'
import { FaChevronDown, FaChevronUp, FaPlus, FaRuler, FaTrash } from 'react-icons/fa';

export default function SizesPricing({toggleSection,expandedSections,formData,sizes,handleSizeChange,setFormData}) {
  return (
      <div className="card mb-4 border-0 shadow-sm">
                  <div
                    className="card-header bg-white border-0 py-3 cursor-pointer"
                    onClick={() => toggleSection('sizes')}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center">
                        <div className="bg-opacity-10 p-2 rounded me-3">
                          <FaRuler size={22} className="text-warning" />
                        </div>
                        <h5 className="mb-0 fw-semibold text-dark">Sizes & Pricing</h5>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="badge bg-warning me-2">{formData.sizes.length}</span>
                        {expandedSections.sizes ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>
                  <div className={`collapse ${expandedSections.sizes ? 'show' : ''}`}>
                    <div className="card-body pt-0">
                      {formData.sizes.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                          <FaRuler className="fs-1 mb-2 opacity-50" />
                          <p className="mb-3">No sizes added yet</p>
                        </div>
                      ) : (
                        formData.sizes.map((size, index) => (
                          <div key={index} className="row g-3 mb-3 p-3 border rounded bg-light">
                            <div className="col-md-4">
                              <label className="form-label fw-semibold text-gray-700">Size</label>
                              <select
                                className="form-select border-gray-300"
                                value={size.size_id || ""}
                                onChange={(e) =>
                                  handleSizeChange(index, "size_id", e.target.value)
                                }
                                required
                              >
                                <option value="">Select Size</option>
                                {sizes.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.size}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold text-gray-700">Price</label>
                              <div className="input-group">
                                <span className="input-group-text bg-light border-gray-300">৳</span>
                                <input
                                  type="number"
                                  className="form-control border-gray-300"
                                  placeholder="1500"
                                  value={size.price || ""}
                                  onChange={(e) =>
                                    handleSizeChange(index, "price", e.target.value)
                                  }
                                  required
                                />
                              </div>
                            </div>
                            <div className="col-md-3">
                              <label className="form-label fw-semibold text-gray-700">Stock</label>
                              <input
                                type="number"
                                className="form-control border-gray-300"
                                placeholder="10"
                                value={size.stock || ""}
                                onChange={(e) =>
                                  handleSizeChange(index, "stock", e.target.value)
                                }
                                required
                              />
                            </div>
                            <div className="col-md-2 d-flex align-items-end">
                              <button
                                type="button"
                                className="btn btn-outline-danger w-100"
                                onClick={() => {
                                  const next = formData.sizes.filter(
                                    (_, i) => i !== index
                                  );
                                  setFormData((s) => ({ ...s, sizes: next }));
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
                          className="btn btn-outline-warning"
                          onClick={() =>
                            setFormData((s) => ({
                              ...s,
                              sizes: [
                                ...s.sizes,
                                { size_id: "", price: "", stock: 0 },
                              ],
                            }))
                          }
                        >
                          <FaPlus className="me-2" /> Add Size Variant
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
  )
}
