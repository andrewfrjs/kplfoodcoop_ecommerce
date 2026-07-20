import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { FaEdit, FaTrash, FaPlus, FaTimes } from 'react-icons/fa';
import './AdminPages.scss';

const EMPTY = { title: '', slug: '', excerpt: '', content: '', image_url: '', author: 'KPL Team' };

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    supabase.from('blogs').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setBlogs(data || []); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const slugify = (s) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const openNew = () => { setEditing('new'); setForm(EMPTY); };
  const openEdit = (b) => {
    setEditing(b.id);
    setForm({ title: b.title, slug: b.slug, excerpt: b.excerpt || '', content: b.content || '', image_url: b.image_url || '', author: b.author || 'KPL Team' });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title) { notify('Title is required.', 'warning'); return; }
    setSaving(true);
    const payload = { ...form, slug: form.slug || slugify(form.title) };
    try {
      if (editing === 'new') {
        const { error } = await supabase.from('blogs').insert(payload);
        if (error) throw error;
        notify('Blog post created.', 'success');
      } else {
        const { error } = await supabase.from('blogs').update(payload).eq('id', editing);
        if (error) throw error;
        notify('Blog post updated.', 'success');
      }
      setEditing(null);
      load();
    } catch (err) {
      notify(err.message || 'Save failed.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this blog post?')) return;
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) throw error;
      notify('Post deleted.', 'info');
      load();
    } catch {
      notify('Delete failed.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-head">
        <h1 className="admin-title">Blog Posts</h1>
        <button className="btn btn-green" onClick={openNew}><FaPlus /> New Post</button>
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing === 'new' ? 'New Post' : 'Edit Post'}</h2>
              <button onClick={() => setEditing(null)}><FaTimes /></button>
            </div>
            <form onSubmit={save} className="modal-form">
              <div className="field">
                <label>Title *</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} required />
              </div>
              <div className="field">
                <label>Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="field">
                <label>Author</label>
                <input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
              </div>
              <div className="field">
                <label>Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="field">
                <label>Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
              </div>
              <div className="field">
                <label>Content</label>
                <textarea rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-green" disabled={saving}>{saving ? <span className="spinner" /> : 'Save'}</button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Author</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id}>
                  <td className="blog-cell">
                    <img src={b.image_url} alt="" />
                    <span>{b.title}</span>
                  </td>
                  <td>{b.author}</td>
                  <td>{new Date(b.created_at).toLocaleDateString()}</td>
                  <td className="action-cell">
                    <button className="icon-btn" onClick={() => openEdit(b)}><FaEdit /></button>
                    <button className="icon-btn danger" onClick={() => remove(b.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {blogs.length === 0 && <p className="empty-row">No posts yet.</p>}
        </div>
      )}
    </div>
  );
}
