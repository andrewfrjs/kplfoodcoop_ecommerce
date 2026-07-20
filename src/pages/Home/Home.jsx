import { useEffect, useState } from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import ProductCard from '../../components/ProductCard/ProductCard';
import { fetchProducts, fetchCategories } from '../../lib/api';
import Newsletter from '../../components/Newsletter/Newsletter';
import Review from '../../components/Review/Review';
import BlogItem from '../Blogs/BlogItem';
import { FaArrowRight, FaTruck, FaShieldAlt, FaTag } from 'react-icons/fa';

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [cats, setCats] = useState([]);
  const [hero, setHero] = useState(null);

  useEffect(() => {
    fetchProducts({ featured: true, limit: 8 }).then(setFeatured);
    fetchCategories().then(setCats);
    fetchProducts({ limit: 1 }).then((p) => setHero(p[0] || null));
  }, []);

  return (
    <section className="home">
      <div className="hero">
        <div className="hero-content">
          <span className="badge badge-green">Fresh from local farms</span>
          <h1>Groceries that bring your kitchen to life</h1>
          <p>Shop fresh produce, cereals, dairy and more. Delivered across Nairobi with fair prices and same-day options.</p>
          <div className="hero-cta">
            <Link to="/shop" className="btn btn-green btn-lg">Shop Now <FaArrowRight /></Link>
            <Link to="/about-us" className="btn btn-secondary btn-lg">Learn More</Link>
          </div>
          <div className="hero-perks">
            <span><FaTruck /> Free delivery over KSH 3,000</span>
            <span><FaShieldAlt /> Quality guaranteed</span>
            <span><FaTag /> Fair farmer prices</span>
          </div>
        </div>
        <div className="hero-image">
          <img src={hero?.image_url || 'https://images.pexels.com/photos/4488636/pexels-photo-4488636.jpeg?auto=compress&cs=tinysrgb&w=1200'} alt="Fresh produce" />
        </div>
      </div>

      <div className="features-strip">
        <div className="feature"><FaTruck className="icon" /><div><strong>Fast Delivery</strong><span>Same-day in Nairobi</span></div></div>
        <div className="feature"><FaShieldAlt className="icon" /><div><strong>Quality Promise</strong><span>Fresh or refunded</span></div></div>
        <div className="feature"><FaTag className="icon" /><div><strong>Best Prices</strong><span>Direct from farmers</span></div></div>
      </div>

      <div className="section-header">
        <p className="sub-heading">Browse by category</p>
        <h1 className="heading">Shop Categories</h1>
      </div>
      <div className="categories">
        {cats.map((cat) => (
          <Link to={`/shop?category=${cat.slug}`} className="cat-card" key={cat.id}>
            <img src={cat.image_url} alt={cat.name} loading="lazy" />
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>

      <Menu />

      <div className="section-header">
        <p className="sub-heading">Explore Our Store</p>
        <h1 className="heading">Popular Products</h1>
      </div>
      <div className="grid popular-grid">
        {featured.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>

      <Review />

      <div className="section-header">
        <p className="sub-heading">From our blog</p>
        <h1 className="heading">Fresh Reads</h1>
      </div>
      <div className="grid blog-grid">
        <BlogItem />
        <BlogItem />
        <BlogItem />
      </div>

      <Newsletter />
    </section>
  );
}
