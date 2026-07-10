import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { pushRecentlyViewed } from '../utils/recentlyViewed';
import RecentlyViewed from '../components/RecentlyViewed';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
        pushRecentlyViewed(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading">Loading product…</p>;
  if (!product) return <p className="error-msg">Product not found.</p>;

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  function handleAddToCart() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    addItem(product, qty);
    navigate('/cart');
  }

  return (
    <>
      <div className="container">
        <div className="detail-grid">
          <img src={product.image} alt={product.title} />
          <div className="detail-info">
            <span className="brand">{product.brand}</span>
            <h1>{product.title}</h1>
            <span className="rating">★ {product.rating} ({product.numReviews} ratings)</span>
            <div className="price-row" style={{ marginTop: 16 }}>
              <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && (
                <>
                  <span className="mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
                  <span className="off">{discount}% off</span>
                </>
              )}
            </div>
            <p>{product.description}</p>
            <p style={{ color: product.stock > 0 ? '#1e8e3e' : '#d64545', fontWeight: 600 }}>
              {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
            </p>

            <div className="qty-selector">
              <span>Quantity:</span>
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity">+</button>
            </div>

            <div className="action-row">
              <button className="btn btn-outline" onClick={handleAddToCart} disabled={product.stock === 0}>
                {added ? 'Added ✓' : 'Add to Cart'}
              </button>
              <button className="btn btn-primary" onClick={handleBuyNow} disabled={product.stock === 0}>
                Buy Now
              </button>
              <button
                className={`btn btn-outline wishlist-btn${isWishlisted(product._id) ? ' active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                {isWishlisted(product._id) ? '♥ Saved' : '♡ Wishlist'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <RecentlyViewed excludeId={product._id} />
    </>
  );
}
