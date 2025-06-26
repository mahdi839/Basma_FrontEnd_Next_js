// app/dashboard/orders/components/OrderTable.jsx
import React from 'react';

export default function OrderTable({ loading, orders }) {
  if (loading) {
    return <div className="text-center py-5">Loading orders...</div>;
  }

  return (
    <div className="card">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>Customer Info</th>
                <th>Ordered Products</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>
                      <h6 className="mb-0">Name: {order.name || 'N/A'}</h6>
                      <small> <strong>Phone:</strong> {order.phone || 'N/A'}</small> <br/>
                      <small> <strong>Address:</strong> {order.address || 'N/A'}</small> <br/>
                      <small> <strong>District:</strong> {order.district || 'N/A'}</small>
                    </td>
                    <td>
                      {order.order_items?.map(item => (
                        <div key={item.id}>
                          {item.title} (qty:{item.qty})
                        </div>
                      ))}
                      {order.order_items?.length > 2 && (
                        <div>+{order.order_items.length - 2} more</div>
                      )}
                    </td>
                    <td>${order.total}</td>
                    <td>
                      <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-primary">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}