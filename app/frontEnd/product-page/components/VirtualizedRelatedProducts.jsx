"use client";
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import ProductCard from "@/app/components/frontEnd/home/slots/components/ProductCard";

export default function VirtualizedRelatedProducts({
  initialProducts,
  productId,
  handleOpenModal,
  handleRelatedAddToCart
}) {
  const parentRef = useRef(null);
  const [columnCount, setColumnCount] = useState(4);
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState("new");
  const [scrollProgress, setScrollProgress] = useState(0);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // Responsive column count
  useEffect(() => {
    const updateColumns = () => {
      if (window.innerWidth < 576) setColumnCount(2);
      else if (window.innerWidth < 768) setColumnCount(2);
      else if (window.innerWidth < 992) setColumnCount(3);
      else setColumnCount(4);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Fetch more products
  const fetchMoreProducts = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/category_products/${productId}?page=${page + 1}`
      );
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        setProducts(prev => [...prev, ...data.data]);
        setPage(prev => prev + 1);
        setHasMore(data.pagination?.has_more || false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching more products:', error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore, productId, baseUrl]);

  // Calculate row count
  const rowCount = Math.ceil(products.length / columnCount);

  // Dynamic row height
  const getRowHeight = () => {
    if (typeof window === 'undefined') return 400;
    if (window.innerWidth < 576) return 360;
    if (window.innerWidth < 768) return 360;
    return 420;
  };

  const getViewportHeight = () => {
    const rowHeight = getRowHeight();
    const visibleRows = Math.min(rowCount, 3);
    return rowHeight * visibleRows;
  };

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => getRowHeight(),
    overscan: 3,
  });

  // Track scroll progress
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrollableDistance = scrollHeight - clientHeight;
      const progress = scrollableDistance > 0 ? (scrollTop / scrollableDistance) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));

      // Load more when 85% scrolled
      if (progress > 85 && hasMore && !isLoading) {
        fetchMoreProducts();
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [fetchMoreProducts, hasMore, isLoading]);

  if (!products || products.length === 0) return null;

  return (
    <div className="related-products-section mt-5">
      {/* Main Container */}
      <div className="bg-white rounded-3 shadow-sm border border-gray-200 p-4">
        {/* Header Section */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <div className="mb-3 mb-md-0">
            <h3 className="h4 fw-semibold mb-1 text-dark">Related Products</h3>
            <p className="text-muted mb-0">
              {products.length.toLocaleString()} products available
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="nav nav-pills">
            {[
              { key: "new", label: "New Arrivals" },
              { key: "top", label: "Best Sellers" },
              { key: "related", label: "Related" },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                className={`nav-link ${activeMenu === item.key ? "active" : ""}`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll Progress Bar */}
        <div className="progress mb-3" style={{ height: '3px' }}>
          <div 
            className="progress-bar bg-primary" 
            role="progressbar" 
            style={{ width: `${scrollProgress}%` }}
            aria-valuenow={scrollProgress}
            aria-valuemin="0"
            aria-valuemax="100"
          />
        </div>

        {/* Virtualized Products Grid */}
        <div className="position-relative">
          <div
            ref={parentRef}
            data-virtualized="true"
            className="virtualized-grid-container border rounded"
            style={{
              height: `${getViewportHeight()}px`,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const startIdx = virtualRow.index * columnCount;
                const rowProducts = products.slice(startIdx, startIdx + columnCount);

                return (
                  <div
                    key={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start}px)`,
                      padding: '15px 0',
                    }}
                  >
                    <div className="row g-4">
                      {rowProducts.map((product) => (
                        <div
                          key={product.id}
                          className="col-6 col-md-4 col-lg-3"
                        >
                          <ProductCard
                            slotProducts={product}
                            handleOpenModal={handleOpenModal}
                            handleAddToCart={handleRelatedAddToCart}
                            slotLength={products.length}
                            
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Loading Indicator */}
              {isLoading && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="d-flex align-items-center gap-3 px-4 py-3 bg-white rounded-pill shadow-sm border">
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <span className="text-muted">Loading more products...</span>
                  </div>
                </div>
              )}

              {/* End of List Indicator */}
              {!hasMore && products.length > 20 && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                  }}
                >
                  <div className="px-3 py-2 bg-light rounded-pill">
                    <span className="text-muted small">All products loaded</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="text-center mt-3">
            <small className="text-muted">
              <i className="bi bi-arrow-down me-1"></i>
              Scroll to see more products
            </small>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Standard Bootstrap-like scrollbar */
        .virtualized-grid-container {
          scrollbar-width: thin;
          scrollbar-color: #6c757d #f8f9fa;
        }

        .virtualized-grid-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .virtualized-grid-container::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 4px;
        }

        .virtualized-grid-container::-webkit-scrollbar-thumb {
          background-color: #adb5bd;
          border-radius: 4px;
          border: 2px solid #f8f9fa;
        }

        .virtualized-grid-container::-webkit-scrollbar-thumb:hover {
          background-color: #6c757d;
        }

        /* Fade-in animation for new rows */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Apply animation to virtual rows */
        .virtualized-grid-container > div > div > div {
          animation: fadeIn 0.3s ease-out;
        }

        /* Product card hover effect */
        .related-products-section .card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .related-products-section .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1) !important;
        }

        /* Custom nav-pills style */
        .nav-pills .nav-link {
          padding: 0.5rem 1rem;
          margin-right: 0.5rem;
          border-radius: 20px;
          color: #6c757d;
          border: 1px solid #dee2e6;
          background: transparent;
        }

        .nav-pills .nav-link.active {
          background-color: #0d6efd;
          border-color: #0d6efd;
          color: white;
        }

        .nav-pills .nav-link:not(.active):hover {
          background-color: #f8f9fa;
          color: #495057;
        }

        /* Container shadow on hover */
        .related-products-section .bg-white {
          transition: box-shadow 0.3s ease;
        }

        .related-products-section .bg-white:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08) !important;
        }

        /* Smooth scrolling */
        .virtualized-grid-container {
          scroll-behavior: smooth;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .virtualized-grid-container {
            height: 500px !important;
          }
          
          .nav-pills {
            width: 100%;
            justify-content: center;
            margin-top: 1rem;
          }
          
          .nav-pills .nav-link {
            padding: 0.375rem 0.75rem;
            font-size: 0.875rem;
          }
        }

        @media (max-width: 576px) {
          .virtualized-grid-container {
            height: 450px !important;
          }
          
          h3.h4 {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}