import ProductImage from "./ProductImage";
import ProductCategories from "./ProductCategories";
import ProductPricing from "./ProductPricing";
import ProductActions from "./ProductActions";
import { FaQuestionCircle, FaVideo, FaBox } from "react-icons/fa";

export default function MobileCardView({ products, onShowVariants, onDelete }) {
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
      <div className="text-center py-5">
        <FaBox className="fa-3x mb-3 text-muted" />
        <h5 className="text-muted">No Products Found</h5>
        <p className="text-muted">Get started by adding your first product</p>
      </div>
    );
  }

  return (
    <div className="row g-3">
      {products.map((product) => (
        <div key={product.id} className="col-12">
          <div className="card border-0 shadow-sm product-card">
            <div className="card-body">
              <div className="row align-items-start">
                <div className="col-3">
                  <ProductImage 
                    images={product.images} 
                    title={product.title}
                    size="md"
                  />
                </div>
                
                <div className="col-9">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">{truncateText(product.title, 30)}</h6>
                      <small className="text-muted d-block">
                        Created: {formatCreatedAt(product.created_at)}
                      </small>
                      <span className="badge bg-secondary">ID: {product.id}</span>
                    </div>
                    <ProductActions 
                      productId={product.id}
                      onDelete={() => onDelete(product.id)}
                      variant="mobile"
                    />
                  </div>

                  {product.short_description && (
                    <p className="text-muted small mb-2">
                      {truncateText(product.short_description, 50)}
                    </p>
                  )}

                  <div className="mb-2">
                    <ProductCategories categories={product.category} />
                  </div>

                  <div className="mb-2">
                    <ProductPricing 
                      product={product} 
                      onShowVariants={() => onShowVariants(product)}
                      variant="mobile"
                    />
                  </div>

                  <div className="d-flex justify-content-between align-items-center text-muted small">
                    {product.faqs?.length > 0 && (
                      <span>
                        <FaQuestionCircle className="me-1" />
                        {product.faqs.length} FAQ{product.faqs.length !== 1 ? 's' : ''}
                      </span>
                    )}
                    {product.video_url && (
                      <a href={product.video_url} target="_blank" rel="noopener noreferrer" className="text-success">
                        <FaVideo className="me-1" />
                        Video
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}