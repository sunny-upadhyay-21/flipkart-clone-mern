import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Orders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const justPlaced = searchParams.get('placed');

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    api
      .get('/orders/mine')
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || loading) return <p className="loading">Loading orders…</p>;

  if (!user) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="icon">🔒</div>
          <p>Please log in to view your orders.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">Your Orders</h2>
      {justPlaced && <div className="form-success">Order placed successfully! 🎉</div>}
      {orders.length === 0 && <p className="empty-state">You haven't placed any orders yet.</p>}
      {orders.map((order) => (
        <div className="cart-item" key={order._id} style={{ gridTemplateColumns: '1fr auto auto' }}>
          <div>
            <div style={{ fontWeight: 600 }}>Order #{order._id.slice(-8).toUpperCase()}</div>
            <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
              {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
            </div>
          </div>
          <div style={{ textTransform: 'capitalize', fontWeight: 600, color: 'var(--color-teal)' }}>
            {order.status}
          </div>
          <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
            ₹{order.totalAmount.toLocaleString('en-IN')}
          </div>
        </div>
      ))}
    </div>
  );
}
