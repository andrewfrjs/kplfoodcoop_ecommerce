import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useToast } from '../../lib/ToastContext';
import { fetchCategories } from '../../lib/api';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaSearch } from 'react-icons/fa';
import './AdminPages.scss';

const EMPTY = { title: '', slug: '', description: '', price: '', image_url: '', category_id: '', stock: '', rating: '4.5', is_featured: false, is_active: true };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const { notify } = useToast();

  const load = () => {
    setLoading(true);
    supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false); });
  };

  useEffect(() => {
    load();
    fetchCategories().then(setCategories);
  }, []);

  const slugify = (s) => s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  const openNew = () => { setEditing('new'); setForm(EMPTY); };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ title: p.title, slug: p.slug, description: p.description || '', price: String(p.price), image_url: p.image_url || '', category_id: p.category_id || '', stock: String(p.stock), rating: String(p.rating), is_featured: p.is_featured, is_active: p.is_active });
  };

  const save = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price) { notify('Title and price are required.', 'warning'); return; }
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug || slugify(form.title),
      description: form.description,
      price: Number(form.price),
      image_url: form.image_url,
      category_id: form.category_id || null,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 4.5,
      is_featured: form.is_featured,
      is_active: form.is_active,
    };
    try {
      if (editing === 'new') {
        const { error } = await supabase.from('products').insert(payload);
        if (error) throw error;
        notify('Product created.', 'success');
      } else {
        const { error } = await supabase.from('products').update(payload).eq('id', editing);
        if (error) throw error;
        notify('Product updated.', 'success');
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
    if (!confirm('Delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      notify('Product deleted.', 'info');
      load();
    } catch (err) {
      notify('Delete failed.', 'error');
    }
  };

  const filtered = products.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-page">
      <div className="page-head">
        <h1 className="admin-title">Products</h1>
        <button className="btn btn-green" onClick={openNew}><FaPlus /> Add Product</button>
      </div>

      <div className="search-bar">
        <FaSearch />
        <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {editing && (
        <div className="modal-overlay" onClick={() => setEditing(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-head">
              <h2>{editing === 'new' ? 'New Product' : 'Edit Product'}</h2>
              <button onClick={() => setEditing(null)}><FaTimes /></button>
            </div>
            <form onSubmit={save} className="modal-form">
              <div className="field-row">
                <div className="field">
                  <label>Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} required />
                </div>
                <div className="field">
                  <label>Slug</label>
                  <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Price (KSH) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
                </div>
                <div className="field">
                  <label>Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
                </div>
              </div>
              <div className="field-row">
                <div className="field">
                  <label>Category</label>
                  <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                    <option value="">None</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="field">
                  <label>Rating</label>
                  <input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                </div>
              </div>
              <div className="field">
                <label>Image URL</label>
                <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." />
              </div>
              <div className="checkbox-row">
                <label><input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} /> Featured</label>
                <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
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
              <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td className="product-cell">
                    <img src={p.image_url} alt="" />
                    <span>{p.title}</span>
                  </td>
                  <td>{p.categories?.name || '—'}</td>
                  <td>{Number(p.price).toLocaleString()} KSH</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.is_active ? <span className="badge badge-green">Active</span> : <span className="badge badge-grey">Hidden</span>}
                    {p.is_featured && <span className="badge badge-warning" style={{ marginLeft: 4 }}>Featured</span>}
                  </td>
                  <td className="action-cell">
                    <button className="icon-btn" onClick={() => openEdit(p)}><FaEdit /></button>
                    <button className="icon-btn danger" onClick={() => remove(p.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <p className="empty-row">No products found.</p>}
        </div>
      )}
    </div>
  );
}
