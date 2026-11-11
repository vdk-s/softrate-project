const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('softrate_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  async getCategoryBySlug(slug) {
    const res = await fetch(`${API_BASE}/categories/${slug}`);
    if (!res.ok) throw new Error('Category not found');
    return res.json();
  },

  async createCategory(categoryData) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create category');
    }
    return res.json();
  },

  // Posts
  async getPosts({ category, search, tag, page = 1, limit = 9, status = 'published' } = {}) {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    if (tag) params.append('tag', tag);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);
    if (status) params.append('status', status);

    const res = await fetch(`${API_BASE}/posts?${params.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch posts');
    return res.json();
  },

  async getFeaturedPosts() {
    const res = await fetch(`${API_BASE}/posts/featured`);
    if (!res.ok) throw new Error('Failed to fetch featured posts');
    return res.json();
  },

  async getTrendingPosts() {
    const res = await fetch(`${API_BASE}/posts/trending`);
    if (!res.ok) throw new Error('Failed to fetch trending posts');
    return res.json();
  },

  async getPostBySlug(slug) {
    const res = await fetch(`${API_BASE}/posts/${slug}`);
    if (!res.ok) throw new Error('Article not found');
    return res.json();
  },

  async createPost(postData) {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create post');
    }
    return res.json();
  },

  async updatePost(id, postData) {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update post');
    }
    return res.json();
  },

  async deletePost(id) {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to delete post');
    }
    return res.json();
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Authentication failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Analytics & Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/stats/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Subscription failed');
    }
    return res.json();
  },
};

