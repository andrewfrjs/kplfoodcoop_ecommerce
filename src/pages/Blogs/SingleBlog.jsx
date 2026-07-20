import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import Newsletter from '../../components/Newsletter/Newsletter';
import BlogItem from './BlogItem';
import { fetchBlogBySlug, fetchBlogs } from '../../lib/api';
import { ShareSocial } from 'react-share-social';
import './SingleBlog.scss';

export default function SingleBlog() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchBlogBySlug(id)
      .then((b) => {
        setBlog(b);
        fetchBlogs().then((all) => setRelated(all.filter((x) => x.id !== b?.id).slice(0, 3)));
      })
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <section className="single-blog"><div className="spinner" /></section>;
  if (!blog) {
    return (
      <section className="empty-state">
        <h2>Post not found</h2>
        <Link to="/blogs" className="btn btn-green">Back to Blogs</Link>
      </section>
    );
  }

  return (
    <article className="single-blog">
      <Link to="/blogs" className="back-link"><FaArrowAltCircleLeft /> Back to blogs</Link>

      <div className="blog-hero">
        <img src={blog.image_url} alt={blog.title} />
        <div className="hero-overlay">
          <h1>{blog.title}</h1>
          <div className="meta">
            <span>By {blog.author}</span>
            <span>·</span>
            <span>{new Date(blog.created_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="blog-body">
        <p className="excerpt">{blog.excerpt}</p>
        <p className="content-text">{blog.content}</p>

        <div className="share-block">
          <ShareSocial
            url={window.location.href}
            socialTypes={['facebook', 'twitter', 'reddit', 'linkedin']}
            title="Share this article"
          />
        </div>
      </div>

      <div className="related-posts">
        <h2 className="heading">Related Articles</h2>
        <div className="grid">
          {related.map((r) => <BlogItem key={r.id} blog={r} />)}
        </div>
      </div>

      <Newsletter />
    </article>
  );
}
