import { supabase } from './supabaseClient';

// Products
export async function fetchProducts({ categorySlug, search, featured, limit } = {}) {
  let q = supabase.from('products').select('id, title, slug, description, price, image_url, stock, rating, is_featured, category_id, categories(slug, name)').eq('is_active', true);
  if (featured) q = q.eq('is_featured', true);
  if (limit) q = q.limit(limit);
  if (categorySlug) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).maybeSingle();
    if (cat) q = q.eq('category_id', cat.id);
  }
  if (search) q = q.ilike('title', `%${search}%`);
  const { data, error } = await q.order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchProductBySlug(slug) {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(slug, name)')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*').order('name');
  if (error) throw error;
  return data || [];
}

// Reviews
export async function fetchReviews(productId) {
  const { data, error } = await supabase
    .from('reviews')
    .select('id, rating, comment, created_at, user_id, profiles(full_name, avatar_url)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function addReview(productId, rating, comment) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Sign in to leave a review.');
  const { data, error } = await supabase
    .from('reviews')
    .insert({ product_id: productId, user_id: user.id, rating, comment })
    .select('id, rating, comment, created_at, profiles(full_name, avatar_url)')
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Blogs
export async function fetchBlogs() {
  const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchBlogBySlug(slug) {
  const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).maybeSingle();
  if (error) throw error;
  return data;
}

// Contact + newsletter
export async function submitContact(payload) {
  const { error } = await supabase.from('contacts').insert(payload);
  if (error) throw error;
}

export async function subscribeNewsletter(email) {
  const { error } = await supabase.from('newsletter_subscribers').insert({ email });
  if (error) {
    if (error.code === '23505') return { duplicate: true };
    throw error;
  }
  return { duplicate: false };
}

// Addresses
export async function fetchAddresses(userId) {
  const { data, error } = await supabase.from('addresses').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function saveAddress(userId, payload) {
  if (payload.id) {
    const { data, error } = await supabase.from('addresses').update(payload).eq('id', payload.id).select().maybeSingle();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from('addresses').insert({ ...payload, user_id: userId }).select().maybeSingle();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id) {
  const { error } = await supabase.from('addresses').delete().eq('id', id);
  if (error) throw error;
}

// Orders
export async function createOrder({ user, items, shipping, paymentMethod }) {
  const subtotal = items.reduce((s, i) => s + Number(i.products.price) * i.quantity, 0);
  const shippingCost = subtotal > 3000 ? 0 : 200;
  const total = subtotal + shippingCost;

  const { data: order, error: oErr } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      subtotal,
      shipping: shippingCost,
      total,
      payment_method: paymentMethod,
      shipping_name: shipping.name,
      shipping_phone: shipping.phone,
      shipping_address: shipping.address,
    })
    .select()
    .maybeSingle();
  if (oErr) throw oErr;

  const rows = items.map((i) => ({
    order_id: order.id,
    product_id: i.product_id,
    title: i.products.title,
    price: i.products.price,
    quantity: i.quantity,
    image_url: i.products.image_url,
  }));
  const { error: oiErr } = await supabase.from('order_items').insert(rows);
  if (oiErr) throw oiErr;

  // clear cart
  await supabase.from('cart_items').delete().eq('user_id', user.id);

  return { order, total };
}

export async function fetchOrders(userId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchOrderById(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Profile
export async function updateProfile(userId, payload) {
  const { error } = await supabase.from('profiles').update(payload).eq('id', userId);
  if (error) throw error;
}
