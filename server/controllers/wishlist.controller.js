const db = require('../db/database');

const parseJSON = (val) => {
  try { return JSON.parse(val); } catch { return val; }
};

const getWishlist = (req, res, next) => {
  try {
    const items = db.prepare(`
      SELECT wishlist.id, wishlist.created_at,
             products.id as product_id, products.name, products.brand,
             products.price, products.mrp, products.discount_percent,
             products.images, products.rating, products.review_count,
             products.sizes, products.colors, products.stock
      FROM wishlist
      LEFT JOIN products ON wishlist.product_id = products.id
      WHERE wishlist.user_id = ?
      ORDER BY wishlist.created_at DESC
    `).all(req.user.id);

    res.json({
      items: items.map(item => ({
        ...item,
        images: parseJSON(item.images),
        sizes: parseJSON(item.sizes),
        colors: parseJSON(item.colors),
      }))
    });
  } catch (err) {
    next(err);
  }
};

const toggleWishlist = (req, res, next) => {
  try {
    const { productId } = req.body;

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const existing = db.prepare(
      'SELECT id FROM wishlist WHERE user_id = ? AND product_id = ?'
    ).get(req.user.id, productId);

    if (existing) {
      db.prepare('DELETE FROM wishlist WHERE id = ?').run(existing.id);
      res.json({ added: false, message: 'Removed from wishlist' });
    } else {
      db.prepare(
        'INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)'
      ).run(req.user.id, productId);
      res.json({ added: true, message: 'Added to wishlist' });
    }
  } catch (err) {
    next(err);
  }
};

const getWishlistIds = (req, res, next) => {
  try {
    const items = db.prepare(
      'SELECT product_id FROM wishlist WHERE user_id = ?'
    ).all(req.user.id);

    res.json({ ids: items.map(i => i.product_id) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getWishlist, toggleWishlist, getWishlistIds };
