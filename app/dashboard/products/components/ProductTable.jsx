"use client";
import { FaEdit, FaTrash, FaArrowRight, FaVideo, FaQuestionCircle, FaImage } from "react-icons/fa";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ProductTable({ productData }) {
  const [products, setProducts] = useState(productData);

  let token = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  function formatCreatedAt(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" }).toLowerCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  }

  function truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }

  async function handleDelete(id) {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    });

    if (!result.isConfirmed) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
      await axios.delete(`${baseUrl}api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));

      Swal.fire({
        title: "Successfully Deleted",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "An Error Occurred");
    }
  }

  // Mobile Card Component
  const ProductCard = ({ product }) => (
    <div className="product-card border rounded-3 bg-white shadow-sm mb-3">
      <div className="card-body">
        {/* Header with Image and Actions */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="d-flex align-items-start gap-3">
            {product.images?.length > 0 ? (
              <img
                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].image}`}
                alt="Product"
                className="img-thumbnail rounded"
                style={{ width: "80px", height: "80px", objectFit: "cover" }}
              />
            ) : (
              <div className="img-thumbnail rounded d-flex align-items-center justify-content-center bg-light"
                   style={{ width: "80px", height: "80px" }}>
                <FaImage className="text-muted" size={24} />
              </div>
            )}
            <div>
              <h6 className="fw-bold mb-1">{truncateText(product.title, 30)}</h6>
              <small className="text-muted d-block">Created: {formatCreatedAt(product.created_at)}</small>
              <div className="mt-1">
                <span className="badge bg-primary">ID: {product.id}</span>
              </div>
            </div>
          </div>
          <div className="d-flex gap-2">
            <Link href={`/dashboard/products/edit/${product.id}`}>
              <button className="btn btn-sm btn-outline-primary">
                <FaEdit />
              </button>
            </Link>
            <button 
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDelete(product.id)}
            >
              <FaTrash />
            </button>
          </div>
        </div>

        {/* Product Info */}
        {product.sub_title && (
          <div className="mb-2">
            <small className="text-muted">{truncateText(product.sub_title, 50)}</small>
          </div>
        )}

        {/* Categories */}
        <div className="mb-3">
          <strong className="d-block mb-1 small">Categories:</strong>
          <div className="d-flex flex-wrap gap-1">
            {product.category?.map((category) => (
              <span key={category.id} className="badge bg-info text-white small">
                {category.name}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Variants */}
        <div className="mb-3">
          <strong className="d-block mb-1 small">Pricing:</strong>
          {product.variants?.length > 0 ? (
            <div className="d-flex flex-column gap-1">
              {product.variants.slice(0, 2).map((v) => (
                <div key={v.id} className="d-flex align-items-center gap-1 small">
                  <span className="badge bg-secondary">
                    {v.attribute}: {v.value}
                  </span>
                  <FaArrowRight size={10} />
                  <span className="badge bg-success">${v.price || product.price}</span>
                </div>
              ))}
              {product.variants.length > 2 && (
                <small className="text-muted">+{product.variants.length - 2} more variants</small>
              )}
            </div>
          ) : product.price ? (
            <span className="badge bg-success">Base Price: ${product.price}</span>
          ) : (
            <span className="badge bg-warning text-dark">No price set</span>
          )}
        </div>

        {/* Additional Info */}
        <div className="row small text-muted">
          {product.faqs?.length > 0 && (
            <div className="col-6">
              <FaQuestionCircle className="me-1" />
              {product.faqs.length} FAQ{product.faqs.length !== 1 ? 's' : ''}
            </div>
          )}
          {product.video_url && (
            <div className="col-6">
              <FaVideo className="me-1" />
              Has Video
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Table View */}
      <div className="d-none d-lg-block">
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '70px' }}>Image</th>
                    <th style={{ minWidth: '180px' }}>Product Info</th>
                    <th style={{ minWidth: '120px' }}>Categories</th>
                    <th style={{ minWidth: '140px' }}>Pricing</th>
                    <th style={{ width: '80px' }}>FAQ</th>
                    <th style={{ width: '80px' }}>Video</th>
                    <th style={{ width: '90px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <div className="text-muted">
                          <i className="fas fa-box-open fa-3x mb-3 d-block"></i>
                          <h5>No Products Found</h5>
                          <p className="mb-0">Get started by adding your first product</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr key={product.id} className="product-row">
                        <td>
                          {product.images?.length > 0 ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${product.images[0].image}`}
                              alt="Product"
                              className="img-thumbnail rounded"
                              style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            />
                          ) : (
                            <div className="img-thumbnail rounded d-flex align-items-center justify-content-center bg-light"
                                 style={{ width: "50px", height: "50px" }}>
                              <FaImage className="text-muted" size={14} />
                            </div>
                          )}
                        </td>

                        <td>
                          <h6 className="fw-bold mb-1 text-dark">{truncateText(product.title, 40)}</h6>
                          {product.sub_title && (
                            <small className="text-muted d-block">{truncateText(product.sub_title, 60)}</small>
                          )}
                          <small className="text-muted">
                            Created: {formatCreatedAt(product.created_at)}
                          </small>
                        </td>

                        <td>
                          <div className="d-flex flex-column gap-1">
                            {product.category?.slice(0, 3).map((category) => (
                              <span key={category.id} className="badge bg-info text-white small">
                                {truncateText(category.name, 20)}
                              </span>
                            ))}
                            {product.category?.length > 3 && (
                              <small className="text-muted">+{product.category.length - 3} more</small>
                            )}
                          </div>
                        </td>

                        <td>
                          <div className="d-flex flex-column gap-1">
                            {product.variants?.length > 0 ? (
                              product.variants.slice(0, 2).map((v) => (
                                <div key={v.id} className="d-flex align-items-center gap-1 small">
                                  <span className="badge bg-light text-dark border">
                                    {v.attribute}: {v.value}
                                  </span>
                                  <FaArrowRight size={10} className="text-muted" />
                                  <span className="text-success fw-semibold">${v.price || product.price}</span>
                                </div>
                              ))
                            ) : product.price ? (
                              <div className="text-success fw-semibold">${product.price}</div>
                            ) : (
                              <span className="text-muted small">No price</span>
                            )}
                            {product.variants?.length > 2 && (
                              <small className="text-muted">
                                +{product.variants.length - 2} more variants
                              </small>
                            )}
                          </div>
                        </td>

                        <td className="text-center">
                          {product.faqs?.length > 0 ? (
                            <span className="badge bg-primary bg-opacity-10 text-primary border-0">
                              {product.faqs.length}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>

                        <td className="text-center">
                          {product.video_url ? (
                            <FaVideo className="text-success" />
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>

                        <td>
                          <div className="d-flex gap-1">
                            <Link href={`/dashboard/products/edit/${product.id}`}>
                              <button className="btn btn-sm btn-outline-primary" title="Edit">
                                <FaEdit size={14} />
                              </button>
                            </Link>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(product.id)}
                              title="Delete"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Card View */}
      <div className="d-block d-lg-none">
        {products.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-box-open fa-3x mb-3 text-muted"></i>
            <h5 className="text-muted">No Products Found</h5>
            <p className="text-muted">Get started by adding your first product</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .product-card {
          transition: all 0.3s ease;
        }
        .product-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
        }
        .product-row:hover {
          background-color: #f8f9fa;
        }
        @media (max-width: 576px) {
          .product-card {
            margin-left: -1rem;
            margin-right: -1rem;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
    </>
  );
}