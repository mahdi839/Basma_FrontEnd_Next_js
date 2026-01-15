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

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "";

  // 🔥 DEV MODE: turn 20 API products into 100,000 virtual products
  // useEffect(() => {
  //   if (!initialProducts || initialProducts.length === 0) return;

  //   const TARGET = 100000; 
  //   const source = initialProducts;

  //   const bigList = Array.from({ length: TARGET }, (_, i) => {
  //     const base = source[i % source.length];

  //     return {
  //       ...base,
  //       id: `${base.id}-${i}`,    
  //       __virtualIndex: i,        
  //       title: `${base.title} #${i + 1}`,
  //     };
  //   });

  //   setProducts(bigList);
  //   setHasMore(false); // stop infinite API loading
  // }, [initialProducts]);

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
    // if (process.env.NODE_ENV === "development") return;
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

  // Dynamic row height based on screen size
  const getRowHeight = () => {
    if (typeof window === 'undefined') return 400;
    if (window.innerWidth < 576) return 350;
    if (window.innerWidth < 768) return 350;
    return 380;
  };

  const getViewportHeight = () => {
    const rowHeight = getRowHeight();
    const visibleRows = Math.min(rowCount, 4); // 👈 don't exceed actual rows
    return rowHeight * visibleRows;
  };



  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => getRowHeight(),
    overscan: 5,
  });

  // Detect when user scrolls near bottom
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollElement;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when 90% scrolled
      if (scrollPercentage > 0.9 && hasMore && !isLoading) {
        fetchMoreProducts();
      }
    };

    scrollElement.addEventListener('scroll', handleScroll);
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, [fetchMoreProducts, hasMore, isLoading]);

  if (!products || products.length === 0) return null;

  return (
    <div className="related-products-section mt-5 pt-4">
      {/* Box Container with Shadow */}
      <div className="bg-white rounded-2xl shadow-lg p-4 p-md-5 border border-gray-100">
        <div className="row position-relative">
          <div className="col-12 d-flex justify-content-between align-items-center mb-3 position-relative">
            <h5
              className="related-heading font-weight-bold mb-0"
              style={{
                fontWeight: "400",
                color: "#222",
                fontFamily: "'Raleway', sans-serif"
              }}
            >
              Our Latest Products
              <span className="ms-2 text-muted" style={{ fontSize: '0.9rem' }}>
                ({products.length.toLocaleString()} items)
              </span>
            </h5>
          </div>

          <div className="col-12 position-relative ">
            <hr className="related-hr m-0" />
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "2rem",
                width: "120px",
                height: "4px",
                background: "linear-gradient(90deg, #7d0ba7 0%, #9d4edd 100%)",
                zIndex: "1",
                borderRadius: "2px",
              }}
            />
          </div>

          {/* Virtualized Grid Container */}
          <div className="col-12">
            <div
              ref={parentRef}
              data-virtualized="true"
              className="virtualized-grid-container"
              style={{
                height: `${getViewportHeight()}px`,
                position: 'relative',
                borderRadius: '12px',
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
                        padding: '10px 0',
                      }}
                    >
                      <div className="row g-3 gx-3 mx-0">
                        {rowProducts.map((product) => (
                          <div
                            key={product.id}
                            className="col-6 col-md-4 col-lg-3 px-2 px-sm-3"
                          >
                            {/* ProductCard container - NO FIXED HEIGHT */}
                            <div>
                              <ProductCard
                                slotProducts={product}
                                handleOpenModal={handleOpenModal}
                                handleAddToCart={handleRelatedAddToCart}
                                slotLength={products.length}
                                className="related-product-card h-100"
                              />
                            </div>
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
                      bottom: '30px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      padding: '12px 24px',
                      background: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '25px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      zIndex: 10,
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(125, 11, 167, 0.1)',
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #7d0ba7',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                      }}
                    />
                    <span style={{
                      color: '#666',
                      fontSize: '14px',
                      fontWeight: '500',
                      fontFamily: "'Inter', sans-serif"
                    }}>
                      Loading more products...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Custom scrollbar styles */
        .virtualized-grid-container {
          scrollbar-width: thin;
          scrollbar-color: #9d4edd #f5f5f5;
        }

        .virtualized-grid-container::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .virtualized-grid-container::-webkit-scrollbar-track {
          background: #f5f5f5;
          border-radius: 10px;
          margin: 4px;
        }

        .virtualized-grid-container::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #9d4edd 0%, #7d0ba7 100%);
          border-radius: 10px;
          border: 2px solid #f5f5f5;
          transition: all 0.3s ease;
        }

        .virtualized-grid-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #7d0ba7 0%, #5a189a 100%);
          transform: scale(1.1);
        }

        .virtualized-grid-container::-webkit-scrollbar-corner {
          background: #f5f5f5;
          border-radius: 0 12px 0 0;
        }

        /* Remove horizontal scrollbar */
        .virtualized-grid-container {
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }

        /* Smooth scrolling */
        .virtualized-grid-container {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for Firefox */
        @supports (scrollbar-color: auto) {
          .virtualized-grid-container {
            scrollbar-color: #9d4edd #f5f5f5;
            scrollbar-width: thin;
          }
        }

        /* Hide scrollbar when not hovering */
        .virtualized-grid-container:not(:hover)::-webkit-scrollbar-thumb {
          background: #c7c7c7;
        }

        /* Related product card - keep original styling */
        .related-product-card {
          /* Let the original ProductCard styling remain */
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .virtualized-grid-container {
            height: 550px !important;
          }
          
          .col-6 {
            padding-left: 8px;
            padding-right: 8px;
          }
          
          .row.g-3.gx-3 {
            margin-left: -8px;
            margin-right: -8px;
          }
        }

        @media (max-width: 576px) {
          .virtualized-grid-container {
            height: 500px !important;
          }
          
          .related-heading {
            font-size: 1.5rem !important;
          }
          
          .col-6 {
            padding-left: 6px;
            padding-right: 6px;
          }
          
          .row.g-3.gx-3 {
            margin-left: -6px;
            margin-right: -6px;
          }
        }

        /* Prevent layout shift */
        .virtualized-grid-container > div {
          min-width: 100%;
          will-change: transform;
        }
      `}</style>
    </div>
  );
}