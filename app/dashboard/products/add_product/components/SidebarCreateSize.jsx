"use client";
import { FaRuler } from "react-icons/fa";

export default function SidebarCreateSize({
  newSize,
  setNewSize,
  handleCreateSize,
  loadingSidebar,
  sizes,
}) {
  return (
    <div className="card mb-4 border-top " style={{ top: "20px" }}>
      <div className="card-header border-0">
        <h5 className="mb-0 fw-semibold">
          <FaRuler className="me-2" />
          Quick Create Size
        </h5>
      </div>

      <div className="card-body">
        <form onSubmit={handleCreateSize}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Size Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g., S, M, L, XL"
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loadingSidebar}
          >
            {loadingSidebar ? "Creating..." : "Create Size"}
          </button>
        </form>

        <hr />

        <h6 className="fw-semibold mb-2">Recent Sizes</h6>
        <div className="d-flex flex-wrap gap-2">
          {sizes.slice(0, 6).map((size) => (
            <span key={size.id} className="badge bg-primary bg-opacity-10 text-white">
              {size.size}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
