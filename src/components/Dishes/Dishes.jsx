import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import { fetchProducts } from '../../lib/api';
import './Dishes.css';

export default function Dishes({ categorySlug, title, subHeading }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ categorySlug, limit: 8 })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categorySlug]);

  return (
    <section className="dishes" id="dishes">
      <div className="section-header">
        {subHeading && <p className="sub-heading">{subHeading}</p>}
        <h1 className="heading">{title}</h1>
      </div>
      {loading ? (
        <div className="loading-grid">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-card" />)}
        </div>
      ) : products.length === 0 ? (
        <p className="empty-state">No products available.</p>
      ) : (
        <div className="grid dishes-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </section>
  );
}
