const db = require('../db/database');

const parseJSON = (val) => {
  try { return JSON.parse(val); } catch { return val; }
};

const formatProduct = (p) => {
  if (!p) return null;
  return {
    ...p,
    sizes: parseJSON(p.sizes),
    colors: parseJSON(p.colors),
    images: parseJSON(p.images),
    tags: parseJSON(p.tags),
  };
};

const getProducts = (req, res, next) => {
  try {
    const {
      category, subcategory, gender, minPrice, maxPrice,
      size, color, brand, sort, search, page = 1, limit = 12,
      discount, rating: minRating, is_featured
    } = req.query;

    let where = ['1=1'];
    let params = [];

    if (category) {
      where.push('categories.slug = ?');
      params.push(category);
    }
    if (subcategory) {
      where.push('products.subcategory = ?');
      params.push(subcategory);
    }
    if (gender) {
      where.push('products.gender = ?');
      params.push(gender);
    }
    if (minPrice) {
      where.push('products.price >= ?');
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      where.push('products.price <= ?');
      params.push(parseFloat(maxPrice));
    }
    if (brand) {
      const brands = brand.split(',');
      where.push(`products.brand IN (${brands.map(() => '?').join(',')})`);
      params.push(...brands);
    }
    if (search) {
      where.push('(products.name LIKE ? OR products.brand LIKE ? OR products.subcategory LIKE ?)');
      const term = `%${search}%`;
      params.push(term, term, term);
    }
    if (size) {
      where.push("products.sizes LIKE ?");
      params.push(`%"${size}"%`);
    }
    if (color) {
      where.push("products.colors LIKE ?");
      params.push(`%${color}%`);
    }
    if (discount) {
      where.push('products.discount_percent >= ?');
      params.push(parseInt(discount));
    }
    if (minRating) {
      where.push('products.rating >= ?');
      params.push(parseFloat(minRating));
    }
    if (is_featured) {
      where.push('products.is_featured = 1');
    }

    let orderBy = 'products.created_at DESC';
    switch (sort) {
      case 'price_asc': orderBy = 'products.price ASC'; break;
      case 'price_desc': orderBy = 'products.price DESC'; break;
      case 'rating': orderBy = 'products.rating DESC'; break;
      case 'newest': orderBy = 'products.created_at DESC'; break;
      case 'discount': orderBy = 'products.discount_percent DESC'; break;
      default: orderBy = 'products.is_featured DESC, products.review_count DESC'; break;
    }

    const whereClause = where.join(' AND ');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const countRow = db.prepare(`
      SELECT COUNT(*) as total
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE ${whereClause}
    `).get(...params);

    const products = db.prepare(`
      SELECT products.*, categories.name as category_name, categories.slug as category_slug
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    res.json({
      products: products.map(formatProduct),
      total: countRow.total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(countRow.total / parseInt(limit))
    });
  } catch (err) {
    next(err);
  }
};

const getFeaturedProducts = (req, res, next) => {
  try {
    const products = db.prepare(`
      SELECT products.*, categories.name as category_name, categories.slug as category_slug
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.is_featured = 1
      LIMIT 8
    `).all();
    res.json({ products: products.map(formatProduct) });
  } catch (err) {
    next(err);
  }
};

const getCategories = (req, res, next) => {
  try {
    const categories = db.prepare('SELECT * FROM categories').all();
    const subcategoryRows = db.prepare(
      'SELECT DISTINCT subcategory, category_id FROM products WHERE subcategory IS NOT NULL'
    ).all();

    const result = categories.map(cat => ({
      ...cat,
      subcategories: subcategoryRows
        .filter(s => s.category_id === cat.id)
        .map(s => s.subcategory)
    }));

    res.json({ categories: result });
  } catch (err) {
    next(err);
  }
};

const getProductById = (req, res, next) => {
  try {
    const { id } = req.params;

    const product = db.prepare(`
      SELECT products.*, categories.name as category_name, categories.slug as category_slug
      FROM products
      LEFT JOIN categories ON products.category_id = categories.id
      WHERE products.id = ?
    `).get(id);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const reviews = db.prepare(`
      SELECT reviews.*, users.name as user_name, users.avatar as user_avatar
      FROM reviews
      LEFT JOIN users ON reviews.user_id = users.id
      WHERE reviews.product_id = ?
      ORDER BY reviews.created_at DESC
    `).all(id);

    res.json({ product: formatProduct(product), reviews });
  } catch (err) {
    next(err);
  }
};

const addReview = (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    const product = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Upsert review
    db.prepare(`
      INSERT INTO reviews (user_id, product_id, rating, comment)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, product_id)
      DO UPDATE SET rating = excluded.rating, comment = excluded.comment, created_at = CURRENT_TIMESTAMP
    `).run(userId, id, rating, comment);

    // Recalculate product rating
    const ratingData = db.prepare(
      'SELECT AVG(rating) as avg_rating, COUNT(*) as count FROM reviews WHERE product_id = ?'
    ).get(id);

    db.prepare(
      'UPDATE products SET rating = ?, review_count = ? WHERE id = ?'
    ).run(
      parseFloat(ratingData.avg_rating.toFixed(1)),
      ratingData.count,
      id
    );

    res.json({ message: 'Review submitted successfully' });
  } catch (err) {
    next(err);
  }
};

const getBrands = (req, res, next) => {
  try {
    const brands = db.prepare('SELECT DISTINCT brand FROM products ORDER BY brand').all();
    res.json({ brands: brands.map(b => b.brand) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getFeaturedProducts, getCategories, getProductById, addReview, getBrands };
