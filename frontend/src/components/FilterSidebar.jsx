import { useEffect, useState } from 'react';
import api from '../api/axios';

const RATING_OPTIONS = [4, 3, 2];

export default function FilterSidebar({ filters, onChange, onClear, isOpen, onClose }) {
  const [brands, setBrands] = useState([]);
  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');

  useEffect(() => {
    api.get('/products/brands').then((res) => setBrands(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
  }, [filters.minPrice, filters.maxPrice]);

  function toggleBrand(brand) {
    const current = filters.brand ? filters.brand.split(',') : [];
    const next = current.includes(brand) ? current.filter((b) => b !== brand) : [...current, brand];
    onChange({ ...filters, brand: next.join(',') });
  }

  function applyPriceRange(e) {
    e.preventDefault();
    onChange({ ...filters, minPrice, maxPrice });
  }

  const selectedBrands = filters.brand ? filters.brand.split(',') : [];
  const activeCount =
    (filters.brand ? selectedBrands.length : 0) +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.minRating ? 1 : 0);

  return (
    <>
      {isOpen && <div className="filter-backdrop" onClick={onClose} />}
      <aside className={`filter-panel${isOpen ? ' open' : ''}`}>
        <div className="filter-panel-header">
          <h4>Filters {activeCount > 0 && <span className="filter-count-badge">{activeCount}</span>}</h4>
          <button className="filter-close" onClick={onClose} aria-label="Close filters">✕</button>
        </div>

        <div className="filter-group">
          <h4>Sort by</h4>
          <select
            className="sort-select"
            value={filters.sort || 'newest'}
            onChange={(e) => onChange({ ...filters, sort: e.target.value })}
          >
            <option value="newest">Newest first</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Customer Rating</option>
          </select>
        </div>

        <div className="filter-group">
          <h4>Price range</h4>
          <form className="price-range-form" onSubmit={applyPriceRange}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <span>–</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <button type="submit" className="btn btn-outline btn-sm">Go</button>
          </form>
        </div>

        <div className="filter-group">
          <h4>Customer rating</h4>
          {RATING_OPTIONS.map((r) => (
            <label key={r}>
              <input
                type="radio"
                name="rating"
                checked={Number(filters.minRating) === r}
                onChange={() => onChange({ ...filters, minRating: r })}
              />
              {'★'.repeat(r)} &amp; up
            </label>
          ))}
        </div>

        {brands.length > 0 && (
          <div className="filter-group">
            <h4>Brand</h4>
            <div className="brand-scroll">
              {brands.map((b) => (
                <label key={b}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => toggleBrand(b)}
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-outline btn-block" onClick={onClear}>
          Clear all filters
        </button>
      </aside>
    </>
  );
}
