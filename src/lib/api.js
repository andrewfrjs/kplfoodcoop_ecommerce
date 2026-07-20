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

// Wishlists
export async function fetchWishlist(userId) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('id, product_id, created_at, products(id, title, slug, price, image_url, stock, is_active)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function fetchWishlistIds(userId) {
  const { data, error } = await supabase
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set((data || []).map((r) => r.product_id));
}

export async function addToWishlist(userId, productId) {
  const { error } = await supabase.from('wishlists').insert({ user_id: userId, product_id: productId });
  if (error) {
    if (error.code === '23505') return { duplicate: true };
    throw error;
  }
  return { duplicate: false };
}

export async function removeFromWishlist(userId, productId) {
  const { error } = await supabase.from('wishlists').delete().eq('user_id', userId).eq('product_id', productId);
  if (error) throw error;
}

// Admin: all wishlists with user + product info
export async function fetchAllWishlists() {
  const { data, error } = await supabase
    .from('wishlists')
    .select('id, created_at, product_id, products(title, slug), profiles(full_name, email)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Notifications
export async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('created_at', { ascending: false })
    .limit(30);
  if (error) throw error;
  return data || [];
}

export async function markNotificationRead(id) {
  const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllNotificationsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', userId)
    .eq('is_read', false);
  if (error) throw error;
  // also mark broadcasts read for this user by marking their copy (broadcasts have null user_id; tracked via separate read state)
}

// Admin notifications
export async function fetchAllNotifications() {
  const { data, error } = await supabase
    .from('notifications')
    .select('*, profiles(email)')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export async function sendNotification({ userId, title, message, type = 'info' }) {
  const payload = { title, message, type };
  if (userId) payload.user_id = userId;
  const { error } = await supabase.from('notifications').insert(payload);
  if (error) throw error;
}

export async function deleteNotification(id) {
  const { error } = await supabase.from('notifications').delete().eq('id', id);
  if (error) throw error;
}

// User cancels their own order (only allowed when pending — enforced by RLS)
export async function cancelOrder(orderId) {
  const { data, error } = await supabase
    .from('orders')
    .update({ status: 'cancelled' })
    .eq('id', orderId)
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

// Admin: all cart items grouped by user
export async function fetchAllCarts() {
  const { data, error } = await supabase
    .from('cart_items')
    .select('id, user_id, product_id, quantity, updated_at, products(title, slug, price, image_url), profiles(email, full_name)')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteCartItem(id) {
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw error;
}

export async function clearUserCart(userId) {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
  if (error) throw error;
}

// Admin: abandoned carts via RPC
export async function fetchAbandonedCarts(hoursOld = 24) {
  const { data, error } = await supabase.rpc('get_abandoned_carts', { hours_old: hoursOld });
  if (error) throw error;
  return data || [];
}

export async function notifyUser(userId, title, message, type = 'info') {
  const { error } = await supabase.from('notifications').insert({ user_id: userId, title, message, type });
  if (error) throw error;
}

// Admin: contacts management
export async function fetchAllContacts() {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function deleteContact(id) {
  const { error } = await supabase.from('contacts').delete().eq('id', id);
  if (error) throw error;
}
