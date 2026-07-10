import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { addItem } = useCart();

  if (items.length === 0) {
    return (
      <div className="container">
        <div className="empty-state">
          <div className="icon">💔</div>
          <p>Your wishlist is empty.</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
            Discover products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="section-title">Your Wishlist ({items.length})</h2>
      <div className="product-grid">
        {items.map((item) => {
          const discount = item.mrp > item.price ? Math.round(((item.mrp - item.price) / item.mrp) * 100) : 0;
          return (
            <div className="product-card wishlist-card" key={item.productId}>
              <button
                className="wishlist-remove"
                onClick={() => removeFromWishlist(item.productId)}
                aria-label="Remove from wishlist"
              >
                ✕
              </button>
              <Link to={`/product/${item.productId}`}>
                {discount > 0 && <span className="ribbon">{discount}% OFF</span>}
                <img src={item.image} alt={item.title} loading="lazy" />
              </Link>
              <div className="body">
                <span className="brand">{item.brand}</span>
                <Link to={`/product/${item.productId}`} className="title">
                  {item.title}
                </Link>
                <div className="price-row">
                  <span className="price">₹{item.price.toLocaleString('en-IN')}</span>
                  {item.mrp > item.price && <span className="mrp">₹{item.mrp.toLocaleString('en-IN')}</span>}
                </div>
                <button
                  className="btn btn-outline btn-block"
                  onClick={() => addItem({ _id: item.productId, title: item.title, image: item.image, price: item.price })}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
