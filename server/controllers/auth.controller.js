const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db/database');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

const register = (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const result = db.prepare(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
    ).run(name, email, hashedPassword);

    const user = db.prepare('SELECT id, name, email, avatar FROM users WHERE id = ?').get(result.lastInsertRowid);
    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch (err) {
    next(err);
  }
};

const login = (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const { password: _, ...userWithoutPassword } = user;
    const token = generateToken(user.id);

    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    next(err);
  }
};

const getMe = (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = (req, res, next) => {
  try {
    const { name, avatar } = req.body;

    db.prepare('UPDATE users SET name = ?, avatar = ? WHERE id = ?').run(
      name || req.user.name,
      avatar || req.user.avatar,
      req.user.id
    );

    const user = db.prepare('SELECT id, name, email, avatar FROM users WHERE id = ?').get(req.user.id);
    res.json({ user });
  } catch (err) {
    next(err);
  }
};

const changePassword = (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = db.prepare('SELECT password FROM users WHERE id = ?').get(req.user.id);
    const isValid = bcrypt.compareSync(currentPassword, user.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.user.id);

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe, updateProfile, changePassword };
