import React from 'react'
import { FaChevronUp, FaQuestionCircle,FaChevronDown,FaTrash,FaPlus } from 'react-icons/fa';

export default function Faq({ toggleSection,
    expandedSections,
    formData,
    handleFAQChange,
    setFormData,}) {
    return (
        <div className="card mb-4 border-0 shadow-sm">
            <div
                className="card-header bg-white border-0 py-3 cursor-pointer"
                onClick={() => toggleSection('faqs')}
            >
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="bg-opacity-10 p-2 rounded me-3">
                            <FaQuestionCircle size={22} className="text-dark" />
                        </div>
                        <h5 className="mb-0 fw-semibold text-dark">Frequently Asked Questions</h5>
                    </div>
                    <div className="d-flex align-items-center">
                        <span className="badge bg-dark me-2">{formData.faqs.length}</span>
                        {expandedSections.faqs ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                </div>
            </div>
            <div className={`collapse ${expandedSections.faqs ? 'show' : ''}`}>
                <div className="card-body pt-0">
                    {formData.faqs.length === 0 ? (
                        <div className="text-center py-4 text-muted">
                            <FaQuestionCircle className="fs-1 mb-2 opacity-50" />
                            <p className="mb-3">No FAQs added yet</p>
                        </div>
                    ) : (
                        formData.faqs.map((faq, index) => (
                            <div key={index} className="row g-3 mb-3 p-3 border rounded bg-light">
                                <div className="col-md-5">
                                    <label className="form-label fw-semibold text-gray-700">Question</label>
                                    <input
                                        type="text"
                                        className="form-control border-gray-300"
                                        placeholder="Enter question"
                                        value={faq.question}
                                        onChange={(e) =>
                                            handleFAQChange(index, "question", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-semibold text-gray-700">Answer</label>
                                    <input
                                        type="text"
                                        className="form-control border-gray-300"
                                        placeholder="Enter answer"
                                        value={faq.answer}
                                        onChange={(e) =>
                                            handleFAQChange(index, "answer", e.target.value)
                                        }
                                    />
                                </div>
                                <div className="col-md-1 d-flex align-items-end">
                                    <button
                                        type="button"
                                        className="btn btn-outline-danger w-100"
                                        onClick={() => {
                                            const next = formData.faqs.filter(
                                                (_, i) => i !== index
                                            );
                                            setFormData((s) => ({ ...s, faqs: next }));
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
                            className="btn btn-outline-dark"
                            onClick={() =>
                                setFormData((s) => ({
                                    ...s,
                                    faqs: [...s.faqs, { question: "", answer: "" }],
                                }))
                            }
                        >
                            <FaPlus className="me-2" /> Add FAQ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
