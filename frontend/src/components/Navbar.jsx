import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../api/axios';

export default function Navbar() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(query)}`);
  }

  const activeCategory = new URLSearchParams(location.search).get('category');

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <Link to="/" className="brand">
            Market<span>kart</span>
          </Link>
          <form className="search-bar" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
          <div className="nav-links">
            {user ? (
              <>
                <span>Hi, {user.name.split(' ')[0]}</span>
                <button className="linklike" onClick={logout}>Logout</button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}
            <Link to="/orders">Orders</Link>
            <Link to="/wishlist" className="cart-badge">
              ♥ Wishlist
              {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="cart-badge">
              Cart
              {count > 0 && <span className="cart-count">{count}</span>}
            </Link>
          </div>
        </div>
      </nav>
      <div className="category-strip">
        <div className="container">
          <Link to="/" className={!activeCategory ? 'active' : ''}>All</Link>
          {categories.map((c) => (
            <Link key={c} to={`/?category=${encodeURIComponent(c)}`} className={activeCategory === c ? 'active' : ''}>
              {c}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
