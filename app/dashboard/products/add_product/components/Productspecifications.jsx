// Example component to display specifications on product detail page

export default function ProductSpecifications({ specifications }) {
  if (!specifications || specifications.length === 0) {
    return null;
  }

  return (
    <div className="product-specifications mt-4">
      <h4 className="fw-bold mb-3">Product Specifications</h4>
      
      <div className="table-responsive">
        <table className="table table-bordered">
          <tbody>
            {specifications.map((spec, index) => (
              <tr key={spec.id || index}>
                <td className="fw-semibold bg-light" style={{ width: '40%' }}>
                  {spec.key}
                </td>
                <td>{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .product-specifications table {
          margin-bottom: 0;
        }
        .product-specifications td {
          padding: 12px 15px;
          vertical-align: middle;
        }
        .bg-light {
          background-color: #f8f9fa !important;
        }
      `}</style>
    </div>
  );
}
