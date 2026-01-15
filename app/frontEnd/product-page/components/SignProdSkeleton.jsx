import React from 'react'

export default function SignProdSkeleton() {
  return (
     <div className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-md-6">
            <div className="placeholder-wave rounded w-100" style={{ aspectRatio: "1/1", background: "#f2f2f2" }} />
          </div>
          <div className="col-12 col-md-6">
            <div className="placeholder-wave rounded w-100" style={{ height: 24, background: "#f2f2f2" }} />
            <div className="mt-3 placeholder-wave rounded w-50" style={{ height: 24, background: "#f2f2f2" }} />
            <div className="mt-4 placeholder-wave rounded w-100" style={{ height: 100, background: "#f2f2f2" }} />
          </div>
        </div>
      </div>
  )
}
