import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getRecentlyViewed } from '../utils/recentlyViewed';

export default function RecentlyViewed({ excludeId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const list = getRecentlyViewed().filter((p) => p._id !== excludeId);
    setItems(list);
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <div className="container recently-viewed">
      <h2 className="section-title">Recently viewed</h2>
      <div className="recently-viewed-scroll">
        {items.map((p) => {
          const discount = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
          return (
            <Link to={`/product/${p._id}`} className="rv-card" key={p._id}>
              <img src={p.image} alt={p.title} loading="lazy" />
              <span className="rv-title">{p.title}</span>
              <div className="price-row">
                <span className="price">₹{p.price.toLocaleString('en-IN')}</span>
                {discount > 0 && <span className="off">{discount}% off</span>}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
