"use client";
import { FaTags } from "react-icons/fa";

export default function SidebarCreateCategory({
  newCategory,
  setNewCategory,
  handleCreateCategory,
  loadingSidebar,
  categories,
}) {
  return (
    <div className="card mb-4 border-top">
      <div className="card-header  border-0">
        <h5 className="mb-0 fw-semibold">
          <FaTags className="me-2" />
          Quick Create Category
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleCreateCategory}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Category Name</label>
            <input
              type="text"
              className="form-control"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Home Category</label>
            <select
              className="form-select"
              value={newCategory.home_category}
              onChange={(e) =>
                setNewCategory({ ...newCategory, home_category: e.target.value })
              }
            >
              <option value="0">Off</option>
              <option value="1">On</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Priority</label>
            <input
              type="number"
              className="form-control"
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
            className="btn btn-success w-100"
            disabled={loadingSidebar}
          >
            {loadingSidebar ? "Creating..." : "Create Category"}
          </button>
        </form>

        <hr />

        <h6 className="fw-semibold mb-2">Recent Categories</h6>
        {categories.slice(0, 5).map((cat) => (
          <div key={cat.id} className="d-flex justify-content-between">
            <span>{cat.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
