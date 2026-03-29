const db = require('../db/database');

const parseJSON = (val) => {
  try { return JSON.parse(val); } catch { return val; }
};

const getOrders = (req, res, next) => {
  try {
    const orders = db.prepare(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
    ).all(req.user.id);

    res.json({
      orders: orders.map(o => ({
        ...o,
        items: parseJSON(o.items),
        address: parseJSON(o.address)
      }))
    });
  } catch (err) {
    next(err);
  }
};

const createOrder = (req, res, next) => {
  try {
    const { address, paymentMethod = 'COD' } = req.body;

    // Get cart items
    const cartItems = db.prepare(`
      SELECT cart.quantity, cart.size, cart.color,
             products.id as product_id, products.name, products.brand,
             products.price, products.mrp, products.images
      FROM cart
      LEFT JOIN products ON cart.product_id = products.id
      WHERE cart.user_id = ?
    `).all(req.user.id);

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderItems = cartItems.map(item => ({
      product_id: item.product_id,
      name: item.name,
      brand: item.brand,
      price: item.price,
      mrp: item.mrp,
      image: JSON.parse(item.images)[0],
      size: item.size,
      color: item.color,
      quantity: item.quantity
    }));

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const result = db.prepare(`
      INSERT INTO orders (user_id, items, address, total, payment_method)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      JSON.stringify(orderItems),
      JSON.stringify(address),
      total,
      paymentMethod
    );

    // Clear cart
    db.prepare('DELETE FROM cart WHERE user_id = ?').run(req.user.id);

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      order: {
        ...order,
        items: parseJSON(order.items),
        address: parseJSON(order.address)
      }
    });
  } catch (err) {
    next(err);
  }
};

const getOrderById = (req, res, next) => {
  try {
    const { id } = req.params;
    const order = db.prepare(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?'
    ).get(id, req.user.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      order: {
        ...order,
        items: parseJSON(order.items),
        address: parseJSON(order.address)
      }
    });
  } catch (err) {
    next(err);
  }
};

const cancelOrder = (req, res, next) => {
  try {
    const { id } = req.params;
    const order = db.prepare(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?"
    ).get(id, req.user.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (order.status !== 'Placed') {
      return res.status(400).json({ error: 'Only placed orders can be cancelled' });
    }

    db.prepare("UPDATE orders SET status = 'Cancelled' WHERE id = ?").run(id);
    res.json({ message: 'Order cancelled' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getOrders, createOrder, getOrderById, cancelOrder };
