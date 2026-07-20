/*
# Wishlists + notifications

## Overview
Adds user wishlists and a notifications system (user-targeted + admin broadcasts).

## New Tables
- `wishlists` — products a user has saved (owner-scoped CRUD)
- `notifications` — messages to a user; `user_id` null = broadcast to everyone

## Security
- `wishlists`: owner-scoped CRUD (select/insert/delete). Admin can read all.
- `notifications`: authenticated users read their own + broadcasts; admin full CRUD.
- New helper `notify_user(target_uid, title, message)` inserts a notification (SECURITY DEFINER, runs as service).

## Notes
1. wishlists.user_id defaults to auth.uid() so client inserts omitting it still pass RLS.
2. notifications.user_id NULL rows are broadcasts visible to all authenticated users.
3. A trigger auto-notifies the admin(s) whenever a new order is placed.
*/

CREATE TABLE IF NOT EXISTS wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, product_id)
);

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text,
  type text NOT NULL DEFAULT 'info' CHECK (type IN ('info','success','warning','error','order','system')),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);

ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- wishlists policies
DROP POLICY IF EXISTS "wishlists_select_own_or_admin" ON wishlists;
CREATE POLICY "wishlists_select_own_or_admin"
ON wishlists FOR SELECT TO authenticated
USING (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "wishlists_insert_own" ON wishlists;
CREATE POLICY "wishlists_insert_own"
ON wishlists FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "wishlists_delete_own" ON wishlists;
CREATE POLICY "wishlists_delete_own"
ON wishlists FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- notifications policies
DROP POLICY IF EXISTS "notifications_select_own_or_admin" ON notifications;
CREATE POLICY "notifications_select_own_or_admin"
ON notifications FOR SELECT TO authenticated
USING (auth.uid() = user_id OR user_id IS NULL OR is_admin());

DROP POLICY IF EXISTS "notifications_insert_admin" ON notifications;
CREATE POLICY "notifications_insert_admin"
ON notifications FOR INSERT TO authenticated
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
CREATE POLICY "notifications_update_own"
ON notifications FOR UPDATE TO authenticated
USING (auth.uid() = user_id OR is_admin())
WITH CHECK (auth.uid() = user_id OR is_admin());

DROP POLICY IF EXISTS "notifications_admin_delete" ON notifications;
CREATE POLICY "notifications_admin_delete"
ON notifications FOR DELETE TO authenticated
USING (is_admin());

-- helper to insert a notification for a specific user (bypasses RLS)
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

-- trigger: notify all admins when a new order is placed
CREATE OR REPLACE FUNCTION notify_admins_new_order()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_rec RECORD;
BEGIN
  FOR admin_rec IN SELECT id FROM profiles WHERE role = 'admin' LOOP
    PERFORM notify_user(admin_rec.id, 'New order received', 'Order #' || UPPER(left(NEW.id::text, 8)) || ' has been placed.', 'order');
  END LOOP;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_inserted ON orders;
CREATE TRIGGER on_order_inserted
AFTER INSERT ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_admins_new_order();
