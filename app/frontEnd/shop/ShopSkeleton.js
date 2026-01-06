export default function ShopSkeleton() {
  return (
    <div className="container py-4">
      <div className="row">
        {/* Sidebar Skeleton */}
        <div className="col-lg-3 col-md-4 mb-4">
          <div className="card shadow-sm p-3">
            <div className="skeleton mb-3" style={{ height: "25px", width: "50%" }}></div>
            {[1,2,3,4].map(i => (
              <div key={i} className="mb-3">
                <div className="skeleton mb-2" style={{ height: "18px", width: "70%" }}></div>
                <div className="skeleton" style={{ height: "15px", width: "90%" }}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="col-lg-9 col-md-8">
          <div className="row">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="col-6 col-lg-4 col-md-4 mb-4">
                <div className="card shadow-sm">
                  <div className="skeleton" style={{ height: "180px" }}></div>
                  <div className="card-body">
                    <div className="skeleton mb-2" style={{ height: "20px", width: "80%" }}></div>
                    <div className="skeleton" style={{ height: "15px", width: "60%" }}></div>
                    <div className="skeleton mt-3" style={{ height: "35px" }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
