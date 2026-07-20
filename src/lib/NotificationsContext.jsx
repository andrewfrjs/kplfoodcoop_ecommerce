import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { useAuth } from './AuthContext';
import { fetchNotifications, markNotificationRead as apiMarkRead, markAllNotificationsRead, deleteNotification as apiDeleteNotif } from './api';

const NotificationsContext = createContext({ notifications: [], unreadCount: 0, refresh: async () => {}, markRead: async () => {}, markAllRead: async () => {}, deleteNotif: async () => {} });

export function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setNotifications([]); return; }
    setLoading(true);
    try {
      const data = await fetchNotifications(user.id);
      setNotifications(data);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
    if (!user) return;
    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, () => refresh())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refresh]);

  const markRead = useCallback(async (id) => {
    try {
      await apiMarkRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {}
  }, []);

  const markAllRead = useCallback(async () => {
    if (!user) return;
    try {
      await markAllNotificationsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {}
  }, [user]);

  const deleteNotif = useCallback(async (id) => {
    try {
      await apiDeleteNotif(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch {}
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const value = { notifications, unreadCount, loading, refresh, markRead, markAllRead, deleteNotif };
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export const useNotifications = () => useContext(NotificationsContext);
