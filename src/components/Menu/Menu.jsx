import { useEffect, useState } from 'react';
import { fetchProducts } from '../../lib/api';
import ProductCard from '../ProductCard/ProductCard';
import './Menu.css';

export default function Menu() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts({ featured: true, limit: 8 })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="menu" id="menu">
      <div className="section-header">
        <p className="sub-heading">Discover More</p>
        <h1 className="heading">Trending Today</h1>
      </div>
      {loading ? (
        <div className="loading-grid">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="empty-state">No featured products yet.</p>
      ) : (
        <div className="grid menu-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}
