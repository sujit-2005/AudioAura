import { useEffect, useState } from 'react';

import { getMyOrders } from '../../api/orderService';
import formatCurrency from '../../utils/formatCurrency';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then((response) => setOrders(response.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="page-shell utility-page">
      <div className="section-heading">
        <span className="section-kicker">Account</span>
        <h1>Order history</h1>
      </div>
      {loading && <p>Loading orders…</p>}
      {!loading && orders.length === 0 && (
        <div className="catalog-state">
          <h2>No orders yet</h2>
          <p>Your fake checkout history will appear here.</p>
        </div>
      )}
      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order._id}>
            <div>
              <h2>Order #{order._id.slice(-6).toUpperCase()}</h2>
              <p>{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
            <span>{order.status}</span>
            <strong>{formatCurrency(order.totalPrice)}</strong>
          </article>
        ))}
      </div>
    </main>
  );
};

export default OrderHistoryPage;
