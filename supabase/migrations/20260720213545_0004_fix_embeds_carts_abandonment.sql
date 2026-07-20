/*
# Fix embeds + cart abandonment + owner order cancel

## Overview
1. Adds foreign keys from wishlists/notifications/cart_items user_id -> profiles(id)
   so Supabase embeds like `wishlists:profiles(email)` resolve.
2. Allows users to delete their own notifications (for the in-app delete icon).
3. Allows users to cancel their own orders, but ONLY when status = 'pending'.
4. Adds updated_at to cart_items + a `get_abandoned_carts()` RPC for the admin carts page.
5. Adds a `notify_user(...)` helper (idempotent) used for cart abandonment + order cancel notifications.

## Notes
- These are additive ALTERs (no data loss).
- FK to profiles(id) is valid because profiles.id already references auth.users(id).
*/

-- 1. Add FKs to profiles so embeds work
-- (drop if exists to be idempotent; these constraints may not exist yet)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'wishlists_user_id_fkey_prof') THEN
    ALTER TABLE wishlists ADD CONSTRAINT wishlists_user_id_fkey_prof
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'notifications_user_id_fkey_prof') THEN
    ALTER TABLE notifications ADD CONSTRAINT notifications_user_id_fkey_prof
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cart_items_user_id_fkey_prof') THEN
    ALTER TABLE cart_items ADD CONSTRAINT cart_items_user_id_fkey_prof
      FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 2. Allow users to delete their own notifications (for in-app delete icon)
DROP POLICY IF EXISTS "notifications_delete_own_or_admin" ON notifications;
CREATE POLICY "notifications_delete_own_or_admin"
ON notifications FOR DELETE TO authenticated
USING (auth.uid() = user_id OR is_admin());

-- 3. Allow users to cancel their own pending orders
-- Existing orders_admin_update only allows is_admin(). Add a user-scoped update restricted to pending.
DROP POLICY IF EXISTS "orders_cancel_own_pending" ON orders;
CREATE POLICY "orders_cancel_own_pending"
ON orders FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND status = 'pending')
WITH CHECK (auth.uid() = user_id);

-- 4. updated_at on cart_items to track abandonment
ALTER TABLE cart_items ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

CREATE OR REPLACE FUNCTION set_cart_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_cart_item_changed ON cart_items;
CREATE TRIGGER on_cart_item_changed
BEFORE INSERT OR UPDATE ON cart_items
FOR EACH ROW
EXECUTE FUNCTION set_cart_updated_at();

-- 5. get_abandoned_carts(): carts whose latest activity is older than the threshold
-- Returns one row per user with their cart rows joined to product + profile info.
CREATE OR REPLACE FUNCTION get_abandoned_carts(hours_old int DEFAULT 24)
RETURNS TABLE (
  user_id uuid,
  email text,
  full_name text,
  product_id uuid,
  title text,
  quantity int,
  price numeric,
  image_url text,
  updated_at timestamptz,
  total numeric
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    u.id AS user_id,
    u.email,
    u.full_name,
    p.id AS product_id,
    p.title,
    c.quantity,
    p.price,
    p.image_url,
    max(c.updated_at) AS updated_at,
    sum(p.price * c.quantity) AS total
  FROM cart_items c
  JOIN profiles u ON u.id = c.user_id
  JOIN products p ON p.id = c.product_id
  WHERE c.updated_at < now() - (hours_old || ' hours')::interval
  GROUP BY u.id, u.email, u.full_name, p.id, p.title, c.quantity, p.price, p.image_url
  ORDER BY updated_at ASC;
$$;

-- 6. notify_user helper (re-declare cleanly; same as before but kept for completeness)
CREATE OR REPLACE FUNCTION notify_user(target_uid uuid, n_title text, n_message text, n_type text DEFAULT 'info')
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type)
  VALUES (target_uid, n_title, n_message, n_type);
END;
$$;
