import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const CartContext = createContext({ items: [], count: 0, subtotal: 0, addToCart: async () => {}, updateQty: async () => {}, removeFromCart: async () => {}, clearCart: async () => {}, loading: false });

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async (uid) => {
    if (!uid) {
      setItems([]);
      return;
    }
    setLoading(true);
    const { data } = await supabase
      .from('cart_items')
      .select('id, product_id, quantity, products(id, title, price, image_url, stock)')
      .eq('user_id', uid);
    setItems(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCart(user?.id);
  }, [user?.id, loadCart]);

  const addToCart = useCallback(async (productId, qty = 1) => {
    if (!user) throw new Error('Please sign in to add items to your cart.');
    const existing = items.find((i) => i.product_id === productId);
    if (existing) {
      const nextQty = existing.quantity + qty;
      const { error } = await supabase.from('cart_items').update({ quantity: nextQty }).eq('id', existing.id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('cart_items').insert({ user_id: user.id, product_id: productId, quantity: qty });
      if (error) throw error;
    }
    await loadCart(user.id);
  }, [user, items, loadCart]);

  const updateQty = useCallback(async (itemId, qty) => {
    if (qty <= 0) return;
    const { error } = await supabase.from('cart_items').update({ quantity: qty }).eq('id', itemId);
    if (error) throw error;
    setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity: qty } : i)));
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    const { error } = await supabase.from('cart_items').delete().eq('id', itemId);
    if (error) throw error;
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  }, []);

  const clearCart = useCallback(async () => {
    if (!user) return;
    const { error } = await supabase.from('cart_items').delete().eq('user_id', user.id);
    if (error) throw error;
    setItems([]);
  }, [user]);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + (Number(i.products?.price || 0) * i.quantity), 0), [items]);

  const value = { items, count, subtotal, addToCart, updateQty, removeFromCart, clearCart, loading };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
