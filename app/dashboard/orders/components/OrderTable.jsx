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
                <th>#</th>
                <th>Customer Info</th>
                <th>Ordered Products</th>
                <th>Order Summery</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order,index) => (
                  <tr key={order.id}>
                    <td>{index+1}</td>
                    <td>
                      <h6 className="mb-0">Name: {order.name || 'N/A'}</h6>
                      <small> <strong>Phone:</strong> {order.phone || 'N/A'}</small> <br/>
                      <small> <strong>Address:</strong> {order.address || 'N/A'}</small> <br/>
                      <small> <strong>District:</strong> {order.district || 'N/A'}</small>
                    </td>
                    <td>
                      {order.order_items?.map((item,itemIndex) => (
                        <div key={item.id}>
                         <strong> {`${itemIndex+1}.`} </strong>{item.title} (qty:{item.qty} )
                        </div>
                      ))}
                    </td>
                    <td>
                      <p> <strong>Shipping Cost:</strong> {order.shipping_cost} </p>
                      <p> <strong>Payment Method:</strong> {order.payment_method} </p>
                      <p><strong>Total:</strong> {order.total} TK</p>
                      
                    </td>
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