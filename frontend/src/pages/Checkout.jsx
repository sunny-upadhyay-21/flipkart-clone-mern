import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../api/axios';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ line1: '', city: '', state: '', pincode: '', phone: '' });
  const [error, setError] = useState('');
  const [placing, setPlacing] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setError('');
    if (!form.line1 || !form.city || !form.pincode || !form.phone) {
      setError('Please fill in all required address fields.');
      return;
    }
    setPlacing(true);
    try {
      const orderItems = items.map((i) => ({
        product: i.productId,
        title: i.title,
        image: i.image,
        price: i.price,
        qty: i.qty,
      }));
      const finalTotal = total >= 499 ? total : total + 49;
      await api.post('/orders', {
        items: orderItems,
        shippingAddress: form,
        totalAmount: finalTotal,
      });
      clearCart();
      navigate('/orders?placed=1');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <p className="empty-state">Your cart is empty. Add items before checking out.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">Checkout</h2>
      <div className="cart-layout">
        <form className="auth-wrap" style={{ margin: 0 }} onSubmit={handlePlaceOrder}>
          <h2>Shipping Address</h2>
          <p className="sub">Where should we deliver your order?</p>
          {error && <div className="form-error">{error}</div>}
          <div className="form-field">
            <label>Address line *</label>
            <input name="line1" value={form.line1} onChange={handleChange} placeholder="House no., street, area" />
          </div>
          <div className="form-field">
            <label>City *</label>
            <input name="city" value={form.city} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>State</label>
            <input name="state" value={form.state} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Pincode *</label>
            <input name="pincode" value={form.pincode} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label>Phone *</label>
            <input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <button className="btn btn-primary btn-block" type="submit" disabled={placing}>
            {placing ? 'Placing order…' : 'Place Order (Cash on Delivery)'}
          </button>
        </form>
        <div className="cart-summary">
          <h4>Order Summary</h4>
          {items.map((i) => (
            <div className="row" key={i.productId}>
              <span>{i.title} × {i.qty}</span>
              <span>₹{(i.price * i.qty).toLocaleString('en-IN')}</span>
            </div>
          ))}
          <div className="row total">
            <span>Total</span>
            <span>₹{(total >= 499 ? total : total + 49).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
