import { Link } from 'react-router-dom';

export default function DealOfDay({ product }) {
  if (!product) return null;
  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <section className="deal-of-day">
      <div className="deal-badge-corner">DEAL OF THE DAY</div>
      <img src={product.image} alt={product.title} />
      <div className="deal-info">
        <span className="brand">{product.brand}</span>
        <h3>{product.title}</h3>
        <p className="deal-desc">{product.description}</p>
        <div className="price-row">
          <span className="price">₹{product.price.toLocaleString('en-IN')}</span>
          <span className="mrp">₹{product.mrp.toLocaleString('en-IN')}</span>
          <span className="off">{discount}% off</span>
        </div>
        <div className="deal-stock-bar">
          <div className="deal-stock-fill" style={{ width: `${Math.min(90, 100 - product.stock)}%` }} />
        </div>
        <span className="deal-stock-label">Selling fast — only {product.stock} left</span>
        <Link to={`/product/${product._id}`} className="btn btn-primary" style={{ marginTop: 14 }}>
          Grab this deal
        </Link>
      </div>
    </section>
  );
}
