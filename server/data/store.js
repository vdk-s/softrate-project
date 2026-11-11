const { categoriesData, articlesData } = require('./seedData');
const jwt = require('jsonwebtoken');

// Clone initial data so mutations are tracked in-memory during lifecycle
let categories = [...categoriesData];
let posts = [...articlesData];

const JWT_SECRET = process.env.JWT_SECRET || 'softrate_super_secret_jwt_key_2026';

const store = {
  // Get all posts with filtering and pagination
  getPosts({ category, search, tag, page = 1, limit = 9, status = 'published' } = {}) {
    let filtered = [...posts];

    if (status && status !== 'all') {
      filtered = filtered.filter((p) => p.status === status);
    }

    if (category) {
      filtered = filtered.filter(
        (p) =>
          p.category?.slug === category ||
          p.category?.name?.toLowerCase() === category.toLowerCase() ||
          p.category?._id === category
      );
    }

    if (tag) {
      filtered = filtered.filter((p) =>
        p.tags?.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
    }

    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          p.content?.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    const totalPosts = filtered.length;
    const totalPages = Math.ceil(totalPosts / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + Number(limit));

    return {
      posts: paginated,
      totalPosts,
      totalPages,
      currentPage: Number(page),
      limit: Number(limit),
    };
  },

  // Featured Posts
  getFeaturedPosts() {
    return posts.filter((p) => p.isFeatured && p.status === 'published');
  },

  // Trending Posts
  getTrendingPosts() {
    return posts.filter((p) => p.isTrending && p.status === 'published');
  },

  // Get post by slug
  getPostBySlug(slug) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) return null;

    // Increment views
    post.views = (post.views || 0) + 1;

    // Related posts
    const relatedPosts = posts
      .filter((p) => p.slug !== slug && p.category?.slug === post.category?.slug)
      .slice(0, 3);

    // Prev & Next
    const currentIndex = posts.findIndex((p) => p.slug === slug);
    const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
    const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

    return {
      post,
      relatedPosts,
      prevPost: prevPost ? { title: prevPost.title, slug: prevPost.slug } : null,
      nextPost: nextPost ? { title: nextPost.title, slug: nextPost.slug } : null,
    };
  },

  // Categories
  getCategories() {
    return categories.map((cat) => {
      const postCount = posts.filter(
        (p) => p.category?.slug === cat.slug && p.status === 'published'
      ).length;
      return { ...cat, postCount };
    });
  },

  getCategoryBySlug(slug) {
    const cat = categories.find((c) => c.slug === slug);
    if (!cat) return null;
    const postCount = posts.filter(
      (p) => p.category?.slug === cat.slug && p.status === 'published'
    ).length;
    return { ...cat, postCount };
  },

  // Admin CRUD
  createPost(data) {
    const matchedCategory = categories.find(
      (c) => c._id === data.category || c.slug === data.category || c.name === data.category
    ) || categories[0];

    const newPost = {
      _id: `post-${Date.now()}`,
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      excerpt: data.excerpt || '',
      content: data.content || '',
      category: matchedCategory,
      author: data.author || 'Softrate Research Staff',
      readTime: data.readTime || '5 min read',
      coverImage: data.coverImage || '',
      tags: data.tags || [],
      isFeatured: !!data.isFeatured,
      isTrending: !!data.isTrending,
      status: data.status || 'published',
      publishedAt: new Date().toISOString(),
      views: 0,
      seo: data.seo || { metaTitle: data.title, metaDescription: data.excerpt },
    };

    posts.unshift(newPost);
    return newPost;
  },

  updatePost(id, data) {
    const index = posts.findIndex((p) => p._id === id || p.slug === id);
    if (index === -1) return null;

    if (data.category) {
      const matchedCategory = categories.find(
        (c) => c._id === data.category || c.slug === data.category || c.name === data.category
      );
      if (matchedCategory) data.category = matchedCategory;
    }

    posts[index] = { ...posts[index], ...data, updatedAt: new Date().toISOString() };
    return posts[index];
  },

  deletePost(id) {
    const index = posts.findIndex((p) => p._id === id || p.slug === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    return true;
  },

  // Stats
  getStats() {
    const total = posts.length;
    const published = posts.filter((p) => p.status === 'published').length;
    const drafts = posts.filter((p) => p.status === 'draft').length;
    const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

    return {
      totalPosts: total,
      publishedPosts: published,
      draftPosts: drafts,
      totalViews,
      totalCategories: categories.length,
      recentPosts: posts.slice(0, 5),
    };
  },

  // Authentication
  authenticate(email, password) {
    const normalizedEmail = (email || '').toLowerCase().trim();
    // Accept demo admin credentials
    if (
      normalizedEmail === 'admin@softrate.com' &&
      (password === 'admin123' || password === 'Softrate@2026')
    ) {
      const user = {
        _id: 'admin-softrate-001',
        username: 'Softrate Administrator',
        email: 'admin@softrate.com',
        role: 'admin',
      };
      const token = jwt.sign(
        { userId: user._id, role: user.role, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return { user, token };
    }
    return null;
  },
};

module.exports = store;
