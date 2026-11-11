const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('softrate_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const parseResponse = async (res, defaultErrMsg = 'Request failed') => {
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!res.ok) {
    const errorMsg = data?.message || (typeof text === 'string' && text.length < 120 ? text : defaultErrMsg);
    throw new Error(errorMsg);
  }

  return data || {};
};

export const api = {
  // Categories
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      return await parseResponse(res, 'Failed to fetch categories');
    } catch (e) {
      console.warn('Categories API fetch error, returning empty list:', e.message);
      return [];
    }
  },

  async getCategoryBySlug(slug) {
    const res = await fetch(`${API_BASE}/categories/${slug}`);
    return parseResponse(res, 'Category not found');
  },

  async createCategory(categoryData) {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return parseResponse(res, 'Failed to create category');
  },

  // Posts
  async getPosts({ category, search, tag, page = 1, limit = 9, status = 'published' } = {}) {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (tag) params.append('tag', tag);
      if (page) params.append('page', page);
      if (limit) params.append('limit', limit);
      if (status) params.append('status', status);

      const res = await fetch(`${API_BASE}/posts?${params.toString()}`);
      return await parseResponse(res, 'Failed to fetch posts');
    } catch (e) {
      console.warn('Posts API fetch error:', e.message);
      return { posts: [], totalPosts: 0, totalPages: 1, currentPage: 1 };
    }
  },

  async getFeaturedPosts() {
    try {
      const res = await fetch(`${API_BASE}/posts/featured`);
      return await parseResponse(res, 'Failed to fetch featured posts');
    } catch (e) {
      console.warn('Featured posts API error:', e.message);
      return [];
    }
  },

  async getTrendingPosts() {
    try {
      const res = await fetch(`${API_BASE}/posts/trending`);
      return await parseResponse(res, 'Failed to fetch trending posts');
    } catch (e) {
      console.warn('Trending posts API error:', e.message);
      return [];
    }
  },

  async getPostBySlug(slug) {
    const res = await fetch(`${API_BASE}/posts/${slug}`);
    return parseResponse(res, 'Article not found');
  },

  async createPost(postData) {
    const res = await fetch(`${API_BASE}/posts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    return parseResponse(res, 'Failed to create post');
  },

  async updatePost(id, postData) {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(postData),
    });
    return parseResponse(res, 'Failed to update post');
  },

  async deletePost(id) {
    const res = await fetch(`${API_BASE}/posts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return parseResponse(res, 'Failed to delete post');
  },

  // Auth
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return parseResponse(res, 'Invalid credentials');
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return parseResponse(res, 'Unauthorized');
  },

  // Analytics & Dashboard Stats
  async getDashboardStats() {
    const res = await fetch(`${API_BASE}/stats/dashboard`, {
      headers: getAuthHeaders(),
    });
    return parseResponse(res, 'Failed to fetch analytics');
  },

  // Newsletter
  async subscribeNewsletter(email) {
    const res = await fetch(`${API_BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return parseResponse(res, 'Subscription failed');
  },
};
