"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaShieldAlt, FaPlus, FaEdit, FaTrash, FaCheck } from "react-icons/fa";

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    permissions: [],
  });

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}api/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data.roles);
    } catch (err) {
      toast.error("Failed to fetch roles");
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}api/permissions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermissions(response.data.permissions);
    } catch (err) {
      toast.error("Failed to fetch permissions");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const endpoint = editMode
        ? `${baseUrl}api/roles/${selectedRoleId}`
        : `${baseUrl}api/roles`;
      const method = editMode ? "put" : "post";

      await axios[method](endpoint, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`Role ${editMode ? "updated" : "created"} successfully`);
      resetForm();
      fetchRoles();
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (role) => {
    setFormData({
      name: role.name,
      permissions: role.permissions.map((p) => p.name),
    });
    setSelectedRoleId(role.id);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (roleId) => {
    if (!confirm("Are you sure you want to delete this role?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${baseUrl}api/roles/${roleId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Role deleted successfully");
      fetchRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete role");
    }
  };

  const togglePermission = (permissionName) => {
    setFormData((prev) => {
      const perms = prev.permissions.includes(permissionName)
        ? prev.permissions.filter((p) => p !== permissionName)
        : [...prev.permissions, permissionName];
      return { ...prev, permissions: perms };
    });
  };

  const resetForm = () => {
    setFormData({ name: "", permissions: [] });
    setEditMode(false);
    setSelectedRoleId(null);
  };

  // Group permissions by category
  const groupedPermissions = permissions.reduce((acc, perm) => {
    const category = perm.name.split(" ")[1] || "other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(perm);
    return acc;
  }, {});

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-1 fw-bold text-gray-800">Role Management</h1>
          <p className="text-muted mb-0">Define roles and their permissions</p>
        </div>
        <button
          className="btn btn-primary px-4 py-2 fw-semibold"
          onClick={() => setShowModal(true)}
        >
          <FaPlus className="me-2" />
          Create Role
        </button>
      </div>

      {/* Roles Grid */}
      <div className="row g-4">
        {roles.map((role) => (
          <div key={role.id} className="col-md-6 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div className="d-flex align-items-center">
                    <div
                      className="bg-primary bg-opacity-10 p-2 rounded me-3"
                      style={{ width: "40px", height: "40px" }}
                    >
                      <FaShieldAlt className="text-primary" />
                    </div>
                    <h5 className="mb-0 fw-bold text-capitalize">{role.name}</h5>
                  </div>
                  {role.name !== "super-admin" && (
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-light"
                        data-bs-toggle="dropdown"
                      >
                        ⋮
                      </button>
                      <ul className="dropdown-menu">
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleEdit(role)}
                          >
                            <FaEdit className="me-2" /> Edit
                          </button>
                        </li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleDelete(role.id)}
                          >
                            <FaTrash className="me-2" /> Delete
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>

                <div className="text-muted small">
                  <strong>{role.permissions.length}</strong> permissions
                </div>

                <div className="mt-3">
                  {role.permissions.slice(0, 5).map((perm) => (
                    <span
                      key={perm.id}
                      className="badge bg-light text-dark me-2 mb-2"
                    >
                      {perm.name}
                    </span>
                  ))}
                  {role.permissions.length > 5 && (
                    <span className="badge bg-secondary mb-2">
                      +{role.permissions.length - 5} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create/Edit Role Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">
                  {editMode ? "Edit Role" : "Create New Role"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Role Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="e.g., manager, editor"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold d-block mb-3">
                      Permissions
                    </label>

                    {Object.entries(groupedPermissions).map(([category, perms]) => (
                      <div key={category} className="mb-4">
                        <h6 className="text-uppercase text-muted small mb-3">
                          {category}
                        </h6>
                        <div className="row g-2">
                          {perms.map((perm) => (
                            <div key={perm.id} className="col-md-6">
                              <div
                                className={`border rounded p-3 cursor-pointer ${
                                  formData.permissions.includes(perm.name)
                                    ? "border-primary bg-primary bg-opacity-10"
                                    : ""
                                }`}
                                onClick={() => togglePermission(perm.name)}
                                style={{ cursor: "pointer" }}
                              >
                                <div className="d-flex align-items-center">
                                  <div
                                    className={`rounded-circle me-3 d-flex align-items-center justify-content-center ${
                                      formData.permissions.includes(perm.name)
                                        ? "bg-primary text-white"
                                        : "bg-light"
                                    }`}
                                    style={{ width: "24px", height: "24px" }}
                                  >
                                    {formData.permissions.includes(perm.name) && (
                                      <FaCheck size={12} />
                                    )}
                                  </div>
                                  <span className="small">{perm.name}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary flex-fill"
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary flex-fill"
                      disabled={loading}
                    >
                      {loading
                        ? "Saving..."
                        : editMode
                        ? "Update Role"
                        : "Create Role"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}