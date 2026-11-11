require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const postRoutes = require('./routes/postRoutes');
const statsRoutes = require('./routes/statsRoutes');
const seoRoutes = require('./routes/seoRoutes');
const newsletterRoutes = require('./routes/newsletterRoutes');
const authorRoutes = require('./routes/authorRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database Connection Middleware for Serverless & Direct Requests
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Middleware Error]:', err);
    next();
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'Softrate Technology Blog Platform',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/authors', authorRoutes);

// Dynamic SEO Routes (sitemap.xml, robots.txt)
app.use('/', seoRoutes);

// Serve Production React Build if present
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  console.log(`[Softrate Server] Serving built React frontend from ${clientDistPath}`);
  app.use(express.static(clientDistPath));
  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path === '/sitemap.xml' ||
      req.path === '/robots.txt'
    ) {
      return next();
    }
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({
    message: err.message || 'An unexpected internal server error occurred.',
  });
});

// Start Server and Database Connection
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`[Softrate Server] Running on http://localhost:${PORT}`);
      console.log(`[Softrate Server] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[Softrate Server] Sitemap: http://localhost:${PORT}/sitemap.xml`);
      console.log(`[Softrate Server] Robots: http://localhost:${PORT}/robots.txt`);
    });
  } catch (error) {
    console.error('[Softrate Server] Initialization failure:', error);
    process.exit(1);
  }
};

// Start Server locally or when not invoked in Vercel serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

// Export Express application instance for Vercel Serverless
module.exports = app;
