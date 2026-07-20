import { useEffect, useMemo, useState } from 'react';
import './Store.scss';
import Flyer from '../../components/Flyer/Flyer';
import ProductCard from '../../components/ProductCard/ProductCard';
import { fetchProducts, fetchCategories } from '../../lib/api';
import { useSearchParams } from 'react-router-dom';
import { FaFilter, FaTimes } from 'react-icons/fa';

export default function Store() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = searchParams.get('category') || '';
  const activeSearch = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ categorySlug: activeCategory, search: activeSearch })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [activeCategory, activeSearch]);

  const sorted = useMemo(() => {
    const arr = [...products];
    if (sort === 'price-low') arr.sort((a, b) => a.price - b.price);
    else if (sort === 'price-high') arr.sort((a, b) => b.price - a.price);
    else if (sort === 'rating') arr.sort((a, b) => b.rating - a.rating);
    return arr;
  }, [products, sort]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const clearFilters = () => setSearchParams({});

  return (
    <section className="shop">
      <Flyer />

      <div className="shop-header">
        <h1 className="heading">All Products</h1>
        <p className="text-muted">{sorted.length} item{sorted.length !== 1 ? 's' : ''}{activeSearch ? ` matching "${activeSearch}"` : ''}</p>
      </div>

      <div className="shop-layout">
        <aside className={`filters ${showFilters ? 'open' : ''}`}>
          <div className="filter-head">
            <h3>Filters</h3>
            <button className="close-filters" onClick={() => setShowFilters(false)}><FaTimes /></button>
          </div>

          <div className="filter-group">
            <h4>Category</h4>
            <div className="filter-options">
              <button className={activeCategory === '' ? 'active' : ''} onClick={() => updateParam('category', '')}>All</button>
              {categories.map((c) => (
                <button key={c.id} className={activeCategory === c.slug ? 'active' : ''} onClick={() => updateParam('category', c.slug)}>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Sort by</h4>
            <select value={sort} onChange={(e) => updateParam('sort', e.target.value)}>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>

          {(activeCategory || activeSearch) && (
            <button className="btn btn-secondary btn-block" onClick={clearFilters}>Clear Filters</button>
          )}
        </aside>

        <div className="shop-main">
          <button className="btn btn-secondary filter-toggle" onClick={() => setShowFilters(true)}>
            <FaFilter /> Filters
          </button>

          {loading ? (
            <div className="grid">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-card" />)}
            </div>
          ) : sorted.length === 0 ? (
            <div className="empty-state">
              <div className="icon-big">🛒</div>
              <h3>No products found</h3>
              <p>Try a different search or category.</p>
            </div>
          ) : (
            <div className="grid products-grid">
              {sorted.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
