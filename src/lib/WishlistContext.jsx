import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';

const WishlistContext = createContext({ ids: new Set(), count: 0, toggle: async () => {}, has: () => false, loading: false });

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState(new Set());
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (uid) => {
    if (!uid) { setIds(new Set()); return; }
    const { data } = await supabase.from('wishlists').select('product_id').eq('user_id', uid);
    setIds(new Set((data || []).map((r) => r.product_id)));
  }, []);

  useEffect(() => { load(user?.id); }, [user?.id, load]);

  const toggle = useCallback(async (productId) => {
    if (!user) throw new Error('Please sign in to save items.');
    const next = new Set(ids);
    if (next.has(productId)) {
      const { error } = await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId);
      if (error) throw error;
      next.delete(productId);
    } else {
      const { error } = await supabase.from('wishlists').insert({ user_id: user.id, product_id: productId });
      if (error) {
        if (error.code === '23505') { next.add(productId); }
        else throw error;
      } else {
        next.add(productId);
      }
    }
    setIds(next);
  }, [user, ids]);

  const has = useCallback((id) => ids.has(id), [ids]);

  const value = { ids, count: ids.size, toggle, has, loading };
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
