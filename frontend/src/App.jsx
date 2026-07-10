import { Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import QuickViewModal from './components/QuickViewModal';

export default function App() {
  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <QuickViewModal />
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-col footer-brand">
            <div className="brand" style={{ color: '#fff' }}>Market<span>kart</span></div>
            <p>Electronics, fashion, home essentials and more — all in one marketplace, delivered fast.</p>
          </div>
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/?category=Electronics">Electronics</Link>
            <Link to="/?category=Fashion">Fashion</Link>
            <Link to="/?category=Home%20%26%20Kitchen">Home &amp; Kitchen</Link>
            <Link to="/?category=Books">Books</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Create account</Link>
            <Link to="/orders">Order history</Link>
            <Link to="/wishlist">Wishlist</Link>
            <Link to="/cart">My cart</Link>
          </div>
          <div className="footer-col">
            <h4>Help</h4>
            <span>Shipping &amp; delivery</span>
            <span>Returns &amp; refunds</span>
            <span>Contact support</span>
            <span>FAQs</span>
          </div>
        </div>
        <div className="footer-bottom">
          Marketkart Clone · Built for learning purposes with React, Node.js &amp; MongoDB
        </div>
      </footer>
    </>
  );
}
