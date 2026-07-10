import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuickView } from '../context/QuickViewContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export default function QuickViewModal() {
  const { product, closeQuickView } = useQuickView();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  function handleAdd() {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleClose(e) {
    if (e.target === e.currentTarget) closeQuickView();
  }

  return (
    <div className="quickview-backdrop" onClick={handleClose}>
      <div className="quickview-modal">
        <button className="quickview-close" onClick={closeQuickView} aria-label="Close quick view">✕</button>
        <div className="quickview-body">
          <div className="quickview-image">
            {discount > 0 && <span className="ribbon">{discount}% OFF</span>}
            <img src={product.image} alt={product.title} />
          </div>
          <div className="quickview-info">
            <span className="brand">{product.brand}</span>
            <h3>{product.title}</h3>
            <span className="rating">★ {product.rating} ({product.numReviews})</span>
            <div className="price-row" style={{ margin: '12px 0' }}>
              <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
              {product.mrp > product.price && (
                <>
                  <span className="mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
                  <span className="off">{discount}% off</span>
                </>
              )}
            </div>
            <p className="quickview-desc">{product.description}</p>

            <div className="qty-selector">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} aria-label="Increase quantity">+</button>
            </div>

            <div className="action-row">
              <button className="btn btn-primary" onClick={handleAdd}>
                {added ? 'Added ✓' : 'Add to Cart'}
              </button>
              <button
                className={`btn btn-outline${isWishlisted(product._id) ? ' active wishlist-btn active' : ''}`}
                onClick={() => toggleWishlist(product)}
              >
                {isWishlisted(product._id) ? '♥ Saved' : '♡ Wishlist'}
              </button>
            </div>
            <Link to={`/product/${product._id}`} className="quickview-full-link" onClick={closeQuickView}>
              View full details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
