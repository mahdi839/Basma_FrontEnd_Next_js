import React from 'react'
import { FaRuler } from 'react-icons/fa'

export default function CreateSize({ sizes, handleCreateSize,newSize,loadingSidebar,setNewSize}) {
    return (
        <div className="card mb-4 border-0 shadow-sm sticky-top" style={{ top: "20px" }}>
            <div className="card-header bg-gradient-primary text-white border-0">
                <h5 className="mb-0 fw-semibold">
                    <FaRuler className="me-2" />
                    Quick Create Size
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleCreateSize}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-gray-700">Size Name</label>
                        <input
                            type="text"
                            className="form-control border-gray-300"
                            placeholder="e.g., S, M, L, XL"
                            value={newSize}
                            onChange={(e) => setNewSize(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-semibold py-2"
                        disabled={loadingSidebar}
                    >
                        {loadingSidebar ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Creating...
                            </>
                        ) : (
                            "Create Size"
                        )}
                    </button>
                </form>

                <hr className="my-4" />

                <h6 className="fw-semibold mb-3 text-gray-700">Recent 6 Sizes</h6>
                <div className="d-flex flex-wrap gap-2">
                    {sizes.slice(0, 6).map((size) => (
                        <span
                            key={size.id}
                            className="badge fs-6 bg-opacity-10 text-primary border border-primary border-opacity-25 px-3 py-2"
                        >
                            {size.size}
                        </span>
                    ))}
                    {sizes.length === 0 && (
                        <p className="text-muted text-center w-100">No sizes available</p>
                    )}
                </div>
            </div>
        </div>
    )
}
