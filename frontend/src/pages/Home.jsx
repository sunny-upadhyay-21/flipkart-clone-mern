import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import FlashSaleBanner from '../components/FlashSaleBanner';
import DealOfDay from '../components/DealOfDay';
import FilterSidebar from '../components/FilterSidebar';
import RecentlyViewed from '../components/RecentlyViewed';

const CATEGORY_ICONS = {
  Electronics: '💻',
  Fashion: '👕',
  'Home & Kitchen': '🏠',
  Books: '📚',
  Sports: '🏋️',
  Toys: '🧸',
};

const TRUST_BADGES = [
  { icon: '🚚', title: 'Free Delivery', desc: 'On orders over ₹499' },
  { icon: '🔒', title: 'Secure Payments', desc: '100% protected checkout' },
  { icon: '↩️', title: 'Easy Returns', desc: '7-day return window' },
  { icon: '🎧', title: '24/7 Support', desc: 'Always here to help' },
];

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [dealProduct, setDealProduct] = useState(null);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = Number(searchParams.get('page')) || 1;
  const brand = searchParams.get('brand') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';
  const sort = searchParams.get('sort') || 'newest';
  const showBrowseSections = !search && !category && !brand && !minPrice && !maxPrice && !minRating;

  const filters = { brand, minPrice, maxPrice, minRating, sort };

  useEffect(() => {
    setLoading(true);
    setError('');
    api
      .get('/products', {
        params: { search, category, brand, minPrice, maxPrice, minRating, sort, page, limit: 12 },
      })
      .then((res) => {
        setProducts(res.data.products);
        setPages(res.data.pages || 1);
        setTotal(res.data.total || 0);
      })
      .catch(() => setError('Could not load products. Is the backend running?'))
      .finally(() => setLoading(false));
  }, [search, category, brand, minPrice, maxPrice, minRating, sort, page]);

  useEffect(() => {
    api.get('/products/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    api
      .get('/products', { params: { limit: 30 } })
      .then((res) => {
        const list = res.data.products || [];
        if (list.length === 0) return;
        const best = list.reduce((top, p) => {
          const d = (p.mrp - p.price) / p.mrp;
          const topD = (top.mrp - top.price) / top.mrp;
          return d > topD ? p : top;
        }, list[0]);
        setDealProduct(best);
      })
      .catch(() => {});
  }, []);

  function goToPage(p) {
    const params = Object.fromEntries(searchParams);
    setSearchParams({ ...params, page: p });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleFilterChange(next) {
    const params = Object.fromEntries(searchParams);
    Object.entries(next).forEach(([key, value]) => {
      if (value === '' || value === undefined || value === null) {
        delete params[key];
      } else {
        params[key] = value;
      }
    });
    params.page = 1;
    setSearchParams(params);
  }

  function handleClearFilters() {
    const params = Object.fromEntries(searchParams);
    ['brand', 'minPrice', 'maxPrice', 'minRating', 'sort'].forEach((k) => delete params[k]);
    setSearchParams(params);
    setFiltersOpen(false);
  }

  return (
    <>
      {showBrowseSections && (
        <section className="hero">
          <div className="hero-inner">
            <div className="hero-copy">
              <span className="eyebrow">Big Savings Days</span>
              <h1>Everything you need, delivered to your door.</h1>
              <p>Electronics, fashion, home essentials and more — all in one marketplace.</p>
              <span className="hero-badge">Up to 60% OFF · Free delivery over ₹499</span>
            </div>
            <div className="hero-stats" aria-hidden="true">
              <div className="hero-stat-card">
                <span className="stat-number">30+</span>
                <span className="stat-label">Products live</span>
              </div>
              <div className="hero-stat-card accent">
                <span className="stat-number">6</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="hero-stat-card">
                <span className="stat-number">4.4★</span>
                <span className="stat-label">Avg. rating</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {showBrowseSections && (
        <div className="container">
          <div className="trust-strip">
            {TRUST_BADGES.map((b) => (
              <div className="trust-badge" key={b.title}>
                <span className="trust-icon" aria-hidden="true">{b.icon}</span>
                <div>
                  <div className="trust-title">{b.title}</div>
                  <div className="trust-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {categories.length > 0 && (
            <>
              <h2 className="section-title">Shop by category</h2>
              <div className="category-tiles">
                {categories.map((c) => (
                  <Link key={c} to={`/?category=${encodeURIComponent(c)}`} className="category-tile">
                    <span className="tile-icon" aria-hidden="true">{CATEGORY_ICONS[c] || '🛍️'}</span>
                    <span className="tile-label">{c}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {showBrowseSections && <FlashSaleBanner />}

      {showBrowseSections && dealProduct && (
        <div className="container">
          <h2 className="section-title">Deal of the day</h2>
          <DealOfDay product={dealProduct} />
        </div>
      )}

      <div className="container">
        <div className="results-header">
          <h2 className="section-title" style={{ margin: 0 }}>
            {search ? `Results for "${search}"` : category ? category : 'Trending right now'}
          </h2>
          <button className="btn btn-outline filter-toggle" onClick={() => setFiltersOpen(true)}>
            ⚙ Filters
          </button>
        </div>

        {loading && <p className="loading">Loading products…</p>}
        {error && <p className="error-msg">{error}</p>}

        {!loading && !error && (
          <div className="layout-with-filters">
            <FilterSidebar
              filters={filters}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />

            <div>
              {!error && products.length === 0 && (
                <div className="empty-state">
                  <div className="icon">📦</div>
                  <p>No products found. Try adjusting your filters or search.</p>
                  <Link to="/" className="btn btn-primary" style={{ marginTop: 16, display: 'inline-flex' }}>
                    Browse all products
                  </Link>
                </div>
              )}

              {products.length > 0 && (
                <>
                  <p className="results-count">{total} product{total !== 1 ? 's' : ''} found</p>
                  <div className="product-grid">
                    {products.map((p) => (
                      <ProductCard key={p._id} product={p} />
                    ))}
                  </div>
                  {pages > 1 && (
                    <div className="pagination">
                      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          className={p === page ? 'active' : ''}
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {showBrowseSections && <RecentlyViewed />}
    </>
  );
}
