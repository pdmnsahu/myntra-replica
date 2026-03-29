const db = require('../db/database');

const parseJSON = (val) => {
  try { return JSON.parse(val); } catch { return val; }
};

const formatCartItem = (item) => ({
  ...item,
  sizes: parseJSON(item.sizes),
  colors: parseJSON(item.colors),
  images: parseJSON(item.images),
  tags: parseJSON(item.tags),
});

const getCart = (req, res, next) => {
  try {
    const items = db.prepare(`
      SELECT cart.id, cart.quantity, cart.size, cart.color,
             products.id as product_id, products.name, products.brand, products.price,
             products.mrp, products.discount_percent, products.images, products.sizes,
             products.colors, products.tags, products.stock
      FROM cart
      LEFT JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = ?
    `).all(req.user.id);

    res.json({ items: items.map(formatCartItem) });
  } catch (err) {
    next(err);
  }
};

const addToCart = (req, res, next) => {
  try {
    const { productId, size, color, quantity = 1 } = req.body;

    const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = db.prepare(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ? AND size = ? AND color = ?'
    ).get(req.user.id, productId, size, color);

    if (existing) {
      const newQty = Math.min(existing.quantity + quantity, product.stock);
      db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(newQty, existing.id);
    } else {
      db.prepare(
        'INSERT INTO cart (user_id, product_id, size, color, quantity) VALUES (?, ?, ?, ?, ?)'
      ).run(req.user.id, productId, size, color, Math.min(quantity, product.stock));
    }

    res.json({ message: 'Added to cart' });
  } catch (err) {
    next(err);
  }
};

const updateCartItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const item = db.prepare('SELECT id FROM cart WHERE id = ? AND user_id = ?').get(id, req.user.id);
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found' });
    }

    if (quantity <= 0) {
      db.prepare('DELETE FROM cart WHERE id = ?').run(id);
    } else {
      db.prepare('UPDATE cart SET quantity = ? WHERE id = ?').run(quantity, id);
    }

    res.json({ message: 'Cart updated' });
  } catch (err) {
    next(err);
  }
};

const removeFromCart = (req, res, next) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM cart WHERE id = ? AND user_id = ?').run(id, req.user.id);
    res.json({ message: 'Removed from cart' });
  } catch (err) {
    next(err);
  }
};

const clearCart = (req, res, next) => {
  try {
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
