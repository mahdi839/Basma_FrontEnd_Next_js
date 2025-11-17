import React from 'react'
import {FaTags } from 'react-icons/fa'


export default function CreateCategory({setNewCategory,newCategory,loadingSidebar,categories,handleCreateCategory}) {
    return (
        <div className="card mb-4 border-0 shadow-sm">
            <div className="card-header bg-success text-white border-0">
                <h5 className="mb-0 fw-semibold">
                    <FaTags className="me-2" />
                    Quick Create Category
                </h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleCreateCategory}>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-gray-700">Category Name</label>
                        <input
                            type="text"
                            className="form-control border-gray-300"
                            placeholder="Enter category name"
                            value={newCategory.name}
                            onChange={(e) =>
                                setNewCategory({ ...newCategory, name: e.target.value })
                            }
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-gray-700">Home Category</label>
                        <select
                            className="form-select border-gray-300"
                            value={newCategory.home_category}
                            onChange={(e) =>
                                setNewCategory({
                                    ...newCategory,
                                    home_category: e.target.value,
                                })
                            }
                        >
                            <option value="0">Off</option>
                            <option value="1">On</option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-semibold text-gray-700">Priority</label>
                        <input
                            type="number"
                            className="form-control border-gray-300"
                            placeholder="0"
                            value={newCategory.priority}
                            onChange={(e) =>
                                setNewCategory({
                                    ...newCategory,
                                    priority: parseInt(e.target.value) || 0,
                                })
                            }
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-success w-100 fw-semibold py-2"
                        disabled={loadingSidebar}
                    >
                        {loadingSidebar ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" />
                                Creating...
                            </>
                        ) : (
                            "Create Category"
                        )}
                    </button>
                </form>

                <hr className="my-4" />

                <h6 className="fw-semibold mb-3 text-gray-700">Recent 5 Categories</h6>
                <div className="list-group list-group-flush">
                    {categories.slice(0, 5).map((category) => (
                        <div
                            key={category.id}
                            className="list-group-item d-flex justify-content-between align-items-center border-0 px-0 py-2"
                        >
                            <span className="fw-medium">{category.name}</span>
                            <span
                                className={`badge ${category.home_category ? "bg-info" : "bg-secondary"
                                    } rounded-pill`}
                            >
                                {category.home_category ? "Home" : "Regular"}
                            </span>
                        </div>
                    ))}
                    {categories.length === 0 && (
                        <p className="text-muted text-center">No categories available</p>
                    )}
                </div>
            </div>
        </div>
    )
}
