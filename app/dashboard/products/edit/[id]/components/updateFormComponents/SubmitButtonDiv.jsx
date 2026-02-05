import React from 'react'
import Button from "@/app/components/dashboard/components/button/Button";
export default function SubmitButtonDiv({ isEditMode, isSubmitting }) {
    return (
        <div className="card border-0 shadow-sm bg-opacity-5">
            <div className="card-body py-4">
                <div className="row align-items-center">
                    <div className="col-md-8">
                        <h6 className="fw-semibold mb-1">
                            {isEditMode ? 'Ready to update your product?' : 'Ready to publish your product?'}
                        </h6>
                        <p className="text-muted mb-0">Review all information before submitting</p>
                    </div>
                    <div className="mt-4">
                        <button
                            type="submit"
                            className="btn btn-primary w-100 d-flex justify-content-center align-items-center"
                            disabled={isSubmitting}
                        >
                            {isSubmitting && (
                                <span
                                    className="spinner-border spinner-border-sm me-2"
                                    role="status"
                                    aria-hidden="true"
                                />
                            )}

                            {isSubmitting
                                ? isEditMode
                                    ? "Updating..."
                                    : "Creating..."
                                : isEditMode
                                    ? "Update Product"
                                    : "Create Product"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
