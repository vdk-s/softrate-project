const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET } = require('../middleware/auth');
const store = require('../data/store');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // 1. Check in-memory store if DB is disconnected or for standard demo credentials
    if (!isDbConnected() || normalizedEmail === 'admin@softrate.com') {
      const demoAuth = store.authenticate(normalizedEmail, password);
      if (demoAuth) {
        return res.json(demoAuth);
      }
      if (!isDbConnected()) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // 2. Database lookup when connected
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    // Fallback to store
    const demoAuth = store.authenticate(req.body?.email, req.body?.password);
    if (demoAuth) return res.json(demoAuth);
    res.status(401).json({ message: 'Authentication failed. Please check credentials.' });
  }
};

exports.getMe = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({
        user: {
          id: req.user?.id || 'admin-softrate-001',
          username: req.user?.username || 'Softrate Administrator',
          email: req.user?.email || 'admin@softrate.com',
          role: 'admin',
        },
      });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.json({
        user: {
          id: req.user?.id,
          username: req.user?.username || 'Softrate Admin',
          email: req.user?.email,
          role: req.user?.role || 'admin',
        },
      });
    }
    res.json({ user });
  } catch (error) {
    res.json({
      user: {
        id: req.user?.id || 'admin-softrate-001',
        username: req.user?.username || 'Softrate Administrator',
        email: req.user?.email || 'admin@softrate.com',
        role: 'admin',
      },
    });
  }
};
