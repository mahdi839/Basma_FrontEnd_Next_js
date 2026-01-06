import React from 'react'
import './featureSkeleton.css'

export default function FeatureSkeleton() {
  return (
    <div className="container mb-3 mb-md-5 mt-0 py-2">
      <div className="row position-relative">
        {/* Render 3 skeleton slots */}
        {[1, 2, 3].map((slotIndex) => (
          <React.Fragment key={slotIndex}>
            {/* Banner Skeleton */}
            <div className="col-12 my-3">
              <div className="skeleton skeleton-banner"></div>
            </div>

            {/* Category Header Skeleton */}
            <div className="col-12 d-flex justify-content-between align-items-center mb-3">
              <div className="skeleton skeleton-title"></div>
              <div className="d-flex gap-2">
                <div className="skeleton skeleton-arrow-btn"></div>
                <div className="skeleton skeleton-arrow-btn"></div>
              </div>
            </div>

            {/* Horizontal Line with Accent */}
            <div className="col-12 position-relative mb-4">
              <div className="skeleton skeleton-hr"></div>
            </div>

            {/* Product Cards Skeleton */}
            <div className="row mx-0 mb-5">
              {[1, 2, 3, 4].map((cardIndex) => (
                <div 
                  key={cardIndex} 
                  className="col-6 col-lg-3 col-md-4 px-1 px-md-2 mb-3"
                >
                  <div className="skeleton-product-card">
                    {/* Product Image */}
                    <div className="skeleton skeleton-product-image"></div>
                    
                    {/* Product Title */}
                    <div className="skeleton-product-body">
                      <div className="skeleton skeleton-product-title"></div>
                      <div className="skeleton skeleton-product-title-short"></div>
                      
                      {/* Price */}
                      <div className="skeleton skeleton-product-price mt-2"></div>
                      
                      {/* Add to Cart Button */}
                      <div className="skeleton skeleton-product-btn mt-3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}