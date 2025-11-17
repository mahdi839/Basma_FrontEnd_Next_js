import React from 'react'
import Button from "@/app/components/dashboard/components/button/Button";
export default function SubmitButtonDiv({isEditMode}) {
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
                    <div className="col-md-4 text-end">
                        <Button type="submit" className="btn btn-primary px-4 py-2 fw-semibold">
                            {isEditMode ? 'Update Product' : 'Create Product'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
