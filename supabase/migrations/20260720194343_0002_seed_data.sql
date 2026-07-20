/*
# Seed sample data

## Overview
Populates categories, products, and blogs with realistic sample data so the
storefront and admin panel have content on first load. Uses remote Pexels
image URLs (no local asset dependency).

## Changes
- Inserts 6 categories (Cereals, Dairy, Fruits, Vegetables, Protein, Other)
- Inserts 12 products across categories (rice, sukuma, tomatoes, milk, eggs, etc.)
- Inserts 3 blog posts
- Idempotent via ON CONFLICT DO NOTHING on slug/name uniqueness.
*/

INSERT INTO categories (name, slug, image_url) VALUES
  ('Cereals', 'cereals', 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Dairy', 'dairy', 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Fruits', 'fruits', 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Vegetables', 'vegetables', 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Protein', 'protein', 'https://images.pexels.com/photos/128408/pexels-photo-128408.jpeg?auto=compress&cs=tinysrgb&w=600'),
  ('Other', 'other', 'https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg?auto=compress&cs=tinysrgb&w=600')
ON CONFLICT (slug) DO NOTHING;

-- helper to get category id by slug
DO $$
DECLARE
  c_cereals uuid := (SELECT id FROM categories WHERE slug='cereals');
  c_dairy uuid := (SELECT id FROM categories WHERE slug='dairy');
  c_fruits uuid := (SELECT id FROM categories WHERE slug='fruits');
  c_veg uuid := (SELECT id FROM categories WHERE slug='vegetables');
  c_protein uuid := (SELECT id FROM categories WHERE slug='protein');
  c_other uuid := (SELECT id FROM categories WHERE slug='other');
BEGIN
  INSERT INTO products (title, slug, description, price, image_url, category_id, stock, rating, is_featured) VALUES
    ('50kg Sack of Rice', '50kg-sack-of-rice', 'Premium quality long grain rice in a 50kg sack. Affordable staple for every household.', 1320.00, 'https://images.pexels.com/photos/735308/pexels-photo-735308.jpeg?auto=compress&cs=tinysrgb&w=800', c_cereals, 100, 4.7, true),
    ('1kg Maize Flour', '1kg-maize-flour', 'Fortified maize flour, freshly milled. Perfect for ugali and porridge.', 120.00, 'https://images.pexels.com/photos/1393382/pexels-photo-1393382.jpeg?auto=compress&cs=tinysrgb&w=800', c_cereals, 200, 4.4, false),
    ('1L Fresh Milk', '1l-fresh-milk', 'Farm fresh pasteurized whole milk delivered cold.', 110.00, 'https://images.pexels.com/photos/248412/pexels-photo-248412.jpeg?auto=compress&cs=tinysrgb&w=800', c_dairy, 80, 4.6, true),
    ('500g Butter', '500g-butter', 'Creamy unsalted butter made from fresh cream.', 450.00, 'https://images.pexels.com/photos/248415/pexels-photo-248415.jpeg?auto=compress&cs=tinysrgb&w=800', c_dairy, 40, 4.3, false),
    ('Bunch Bananas', 'bunch-bananas', 'Sweet ripe bananas, freshly sourced from the farm.', 90.00, 'https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=800', c_fruits, 150, 4.5, true),
    ('Mangoes 1kg', 'mangoes-1kg', 'Juicy sweet mangoes in season.', 220.00, 'https://images.pexels.com/photos/918643/pexels-photo-918643.jpeg?auto=compress&cs=tinysrgb&w=800', c_fruits, 60, 4.8, false),
    ('Sukuma Wiki 1 Bunch', 'sukuma-wiki-1-bunch', 'Fresh collard greens straight from the farm. Washed and ready to cook.', 55.00, 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=800', c_veg, 120, 4.5, true),
    ('Red Tomatoes 1kg', 'red-tomatoes-1kg', 'Firm ripe red tomatoes, great for cooking and salads.', 120.00, 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=800', c_veg, 90, 4.4, false),
    ('Carrots 1kg', 'carrots-1kg', 'Crunchy fresh orange carrots.', 90.00, 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800', c_veg, 70, 4.2, false),
    ('Tray of Eggs', 'tray-of-eggs', 'A tray of 30 fresh farm eggs.', 420.00, 'https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=800', c_protein, 50, 4.6, true),
    ('Whole Chicken 1kg', 'whole-chicken-1kg', 'Fresh dressed whole chicken, hygienically packed.', 550.00, 'https://images.pexels.com/photos/616353/pexels-photo-616353.jpeg?auto=compress&cs=tinysrgb&w=800', c_protein, 30, 4.7, false),
    ('Coca-Cola 500ml', 'coca-cola-500ml', 'Chilled Coca-Cola carbonated soft drink, 500ml bottle.', 90.00, 'https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=800', c_other, 200, 4.3, false)
  ON CONFLICT (slug) DO NOTHING;
END $$;

INSERT INTO blogs (title, slug, excerpt, content, image_url, author) VALUES
  ('5 Healthy Eating Habits to Start Today', '5-healthy-eating-habits', 'Small changes that make a big difference to your diet.', 'Eating healthy does not have to be complicated. Start by adding more vegetables to your plate, drinking plenty of water, and reducing processed sugar. Over time, these small habits compound into lasting health benefits.', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800', 'KPL Team'),
  ('How to Store Fresh Produce Longer', 'store-fresh-produce-longer', 'Simple tricks to keep your fruits and vegetables fresh.', 'Proper storage is the key to reducing food waste. Leafy greens do best in a damp cloth in the fridge, while tomatoes and bananas should stay at room temperature. We share the best practices for each type of produce.', 'https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg?auto=compress&cs=tinysrgb&w=800', 'KPL Team'),
  ('The Benefits of Buying Local', 'benefits-of-buying-local', 'Why supporting local farmers matters for your community.', 'When you buy local produce, you get fresher food, support your community economy, and reduce the environmental cost of long-distance transport. KPLFOODCOOP partners directly with local farmers to bring you the best.', 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg?auto=compress&cs=tinysrgb&w=800', 'KPL Team')
ON CONFLICT (slug) DO NOTHING;
