import { useEffect, useState } from 'react';
import './Blogs.scss';
import BlogItem from './BlogItem';
import Newsletter from '../../components/Newsletter/Newsletter';
import { fetchBlogs } from '../../lib/api';

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs().then((b) => { setBlogs(b); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <section className="blogs">
      <div className="section-header">
        <p className="sub-heading">From the blog</p>
        <h1 className="heading">Fresh Reads</h1>
      </div>
      {loading ? (
        <div className="grid">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton-card" />)}</div>
      ) : blogs.length === 0 ? (
        <p className="empty-state">No posts yet.</p>
      ) : (
        <div className="container">
          {blogs.map((b) => <BlogItem key={b.id} blog={b} />)}
        </div>
      )}
      <Newsletter />
    </section>
  );
}
