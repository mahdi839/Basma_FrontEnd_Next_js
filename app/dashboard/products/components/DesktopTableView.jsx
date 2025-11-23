"use client"
import { FaEdit, FaTrash, FaQuestionCircle, FaVideo, FaImage, FaBox } from "react-icons/fa";
import ProductImage from "./ProductImage";
import ProductCategories from "./ProductCategories";
import ProductPricing from "./ProductPricing";
import ProductActions from "./ProductActions";
import './productIndex.css'
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function DesktopTableView({ products, onShowVariants, onDelete }) {
    const formatCreatedAt = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString("default", { month: "short" }).toLowerCase();
        const year = date.getFullYear().toString().slice(-2);
        return `${day}/${month}/${year}`;
    };

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    };

    if (products.length === 0) {
        return (
            <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                    <div className="text-muted">
                        <FaBox className="fa-3x mb-3 opacity-50" />
                        <h5>No Products Found</h5>
                        <p className="mb-0">Get started by adding your first product</p>
                    </div>
                </div>
            </div>
        );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return (
        <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th style={{ width: '70px' }}>#</th>
                                <th style={{ width: '70px' }}>Image</th>
                                <th style={{ minWidth: '70px' }}>Product Info</th>
                                <th style={{ minWidth: '70px' }}>Colors</th>
                                <th style={{ minWidth: '50px' }}>Status</th>
                                <th style={{ minWidth: '70px' }}>Categories</th>
                                <th style={{ minWidth: '90px' }}>Pricing & Variants</th>
                                <th style={{ width: '60px' }}>FAQ</th>
                                <th style={{ width: '60px' }}>Video</th>
                                <th style={{ width: '90px' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product.id} className="product-row">
                                    <td>
                                        {index + 1}
                                    </td>
                                    <td>
                                        <ProductImage
                                            images={product.images}
                                            title={product.title}
                                            size="sm"
                                        />
                                    </td>

                                    <td>
                                        <h6 className="fw-bold mb-1 text-dark">{truncateText(product.title, 40)}</h6>
                                        {product.short_description && (
                                            <small className="text-muted d-block">
                                                {truncateText(product.short_description, 60)}
                                            </small>
                                        )}
                                        <small className="text-muted">
                                            Created: {formatCreatedAt(product.created_at)}
                                        </small>
                                        <div className="mt-1">
                                            <span className="badge bg-secondary">ID: {product.id}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2 mt-2">
                                            {
                                                product?.colors?.map((color) => (
                                                    <div>
                                                        <Zoom>
                                                            <img
                                                                width={28}
                                                                height={28}
                                                                src={baseUrl + color.image ?? ""}
                                                                alt=""
                                                                className="rounded-circle border"
                                                                style={{ objectFit: 'cover' }}
                                                                onError={(e) => {
                                                                    // Fallback to color code if image fails to load
                                                                    e.target.style.display = 'none';
                                                                }}
                                                            />
                                                        </Zoom>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </td>

                                    <td>
                                        {product?.status ?? "N/A"}
                                    </td>

                                    <td>
                                        <ProductCategories categories={product.category} />
                                    </td>

                                    <td>
                                        <ProductPricing
                                            product={product}
                                            onShowVariants={() => onShowVariants(product)}
                                        />
                                    </td>

                                    <td className="text-center">
                                        {product.faqs?.length > 0 ? (
                                            <span className="text-primary">
                                                <FaQuestionCircle className="me-1" />
                                                {product.faqs.length}
                                            </span>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>

                                    <td className="text-center">
                                        {product.video_url ? (
                                            <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="text-success">
                                                <FaVideo />
                                            </a>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>

                                    <td>
                                        <ProductActions
                                            productId={product.id}
                                            onDelete={() => onDelete(product.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}