import { Link } from 'react-router-dom';

export default function BlogItem({ blog }) {
  const b = blog || {
    title: 'Welcome to KPL FoodCoop',
    slug: 'welcome',
    excerpt: 'Discover fresh, local produce delivered to your door.',
    image_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    author: 'KPL Team',
    created_at: new Date().toISOString(),
  };

  const readingTime = (text = '') => Math.max(1, Math.ceil((text || '').split(' ').length / 200));

  return (
    <Link to={`/blogs/${b.slug}`} className="card blog-card">
      <div className="image">
        <img src={b.image_url} alt={b.title} loading="lazy" />
      </div>
      <div className="content">
        <div className="meta">
          <span className="author">{b.author}</span>
          <span className="duration">{readingTime(b.excerpt)} min read</span>
        </div>
        <h3>{b.title}</h3>
        <p>{b.excerpt}</p>
        <span className="read-more">Read more →</span>
      </div>
    </Link>
  );
}
