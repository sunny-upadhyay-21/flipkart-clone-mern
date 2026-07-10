import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useQuickView } from '../context/QuickViewContext';

export default function ProductCard({ product }) {
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const wishlisted = isWishlisted(product._id);

  function handleWishlistClick(e) {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  }

  function handleQuickViewClick(e) {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  }

  return (
    <Link to={`/product/${product._id}`} className="product-card">
      {discount > 0 && <span className="ribbon">{discount}% OFF</span>}
      <div className="card-icon-stack">
        <button
          className={`wishlist-heart${wishlisted ? ' active' : ''}`}
          onClick={handleWishlistClick}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {wishlisted ? '♥' : '♡'}
        </button>
        <button className="quickview-heart" onClick={handleQuickViewClick} aria-label="Quick view">
          👁
        </button>
      </div>
      <img src={product.image} alt={product.title} loading="lazy" />
      <div className="body">
        <span className="brand">{product.brand}</span>
        <span className="title">{product.title}</span>
        <span className="rating">★ {product.rating} ({product.numReviews})</span>
        <div className="price-row">
          <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
          {product.mrp > product.price && (
            <>
              <span className="mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
              <span className="off">{discount}% off</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
