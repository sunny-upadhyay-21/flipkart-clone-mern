import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const { items, updateQty, removeItem, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleCheckout() {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="icon">🛒</div>
          <p>Your cart is empty.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">Your Cart ({items.length} items)</h2>
      <div className="cart-layout">
        <div>
          {items.map((item) => (
            <div className="cart-item" key={item.productId}>
              <img src={item.image} alt={item.title} />
              <div>
                <div style={{ fontWeight: 600 }}>{item.title}</div>
                <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                  ₹{item.price.toLocaleString('en-IN')} each
                </div>
              </div>
              <div className="qty-selector" style={{ margin: 0 }}>
                <button onClick={() => updateQty(item.productId, item.qty - 1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.productId, item.qty + 1)}>+</button>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  ₹{(item.price * item.qty).toLocaleString('en-IN')}
                </div>
                <button
                  className="linklike"
                  style={{ color: '#d64545', background: 'none', border: 'none', fontSize: '0.8rem' }}
                  onClick={() => removeItem(item.productId)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h4>Price Details</h4>
          <div className="row">
            <span>Subtotal</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div className="row">
            <span>Delivery</span>
            <span>{total >= 499 ? 'FREE' : '₹49'}</span>
          </div>
          <div className="row total">
            <span>Total</span>
            <span>₹{(total >= 499 ? total : total + 49).toLocaleString('en-IN')}</span>
          </div>
          <button className="btn btn-primary btn-block" onClick={handleCheckout} style={{ marginTop: 12 }}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
