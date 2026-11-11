const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');
const store = require('../data/store');

const isDbConnected = () => mongoose.connection.readyState === 1;

// Helper to calculate reading time
const calculateReadTime = (content) => {
  if (!content) return '1 min read';
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  return `${minutes} min read`;
};

// Helper to generate clean slug
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

exports.getPosts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.getPosts(req.query));
    }

    const {
      page = 1,
      limit = 9,
      category,
      search,
      tag,
      status = 'published',
      sort = '-publishedAt',
    } = req.query;

    const query = {};

    if (status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      let catDoc;
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        catDoc = await Category.findById(category);
      } else {
        catDoc = await Category.findOne({ slug: category.toLowerCase() });
      }
      if (catDoc) {
        query.category = catDoc._id;
      } else {
        return res.json({ posts: [], totalPosts: 0, totalPages: 0, currentPage: Number(page) });
      }
    }

    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { excerpt: searchRegex },
        { tags: { $in: [searchRegex] } },
        { author: searchRegex },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const totalPosts = await Post.countDocuments(query);
    const posts = await Post.find(query)
      .populate('category', 'name slug accentColor')
      .populate('authorRef', 'name avatar role')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    // If database is empty, fallback to store
    if (totalPosts === 0 && !category && !search) {
      return res.json(store.getPosts(req.query));
    }

    res.json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / Number(limit)) || 1,
      currentPage: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    console.warn('[PostController] Fallback to in-memory store:', error.message);
    res.json(store.getPosts(req.query));
  }
};

exports.getFeaturedPosts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.getFeaturedPosts());
    }

    let posts = await Post.find({ status: 'published', isFeatured: true })
      .populate('category', 'name slug accentColor')
      .populate('authorRef', 'name avatar role')
      .sort('-publishedAt')
      .limit(3);

    if (posts.length === 0) {
      return res.json(store.getFeaturedPosts());
    }

    res.json(posts);
  } catch (error) {
    res.json(store.getFeaturedPosts());
  }
};

exports.getTrendingPosts = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.getTrendingPosts());
    }

    let posts = await Post.find({ status: 'published', isTrending: true })
      .populate('category', 'name slug accentColor')
      .populate('authorRef', 'name avatar role')
      .sort('-views')
      .limit(4);

    if (posts.length === 0) {
      return res.json(store.getTrendingPosts());
    }

    res.json(posts);
  } catch (error) {
    res.json(store.getTrendingPosts());
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const data = store.getPostBySlug(req.params.slug);
      if (!data) return res.status(404).json({ message: 'Article not found' });
      return res.json(data);
    }

    const post = await Post.findOne({ slug: req.params.slug })
      .populate('category', 'name slug accentColor description')
      .populate('authorRef', 'name avatar role bio');

    if (!post) {
      const fallback = store.getPostBySlug(req.params.slug);
      if (fallback) return res.json(fallback);
      return res.status(404).json({ message: 'Article not found' });
    }

    post.views += 1;
    await post.save();

    const relatedPosts = await Post.find({
      _id: { $ne: post._id },
      category: post.category?._id,
      status: 'published',
    })
      .populate('category', 'name slug accentColor')
      .limit(3)
      .select('title slug coverImage author readTime publishedAt category excerpt');

    const prevPost = await Post.findOne({
      status: 'published',
      publishedAt: { $lt: post.publishedAt },
    })
      .sort('-publishedAt')
      .select('title slug');

    const nextPost = await Post.findOne({
      status: 'published',
      publishedAt: { $gt: post.publishedAt },
    })
      .sort('publishedAt')
      .select('title slug');

    res.json({
      post,
      relatedPosts,
      prevPost,
      nextPost,
    });
  } catch (error) {
    const fallback = store.getPostBySlug(req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(500).json({ message: 'Failed to retrieve article', error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const newPost = store.createPost(req.body);
      return res.status(201).json(newPost);
    }

    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      authorRef,
      coverImage,
      tags,
      readTime,
      status,
      isFeatured,
      isTrending,
      seo,
      publishedAt,
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    const generatedSlug = slug ? generateSlug(slug) : generateSlug(title);
    const existingSlug = await Post.findOne({ slug: generatedSlug });
    const finalSlug = existingSlug ? `${generatedSlug}-${Date.now().toString().slice(-4)}` : generatedSlug;

    const calculatedReadTime = readTime || calculateReadTime(content);

    const post = await Post.create({
      title,
      slug: finalSlug,
      excerpt,
      content,
      category,
      author: author || 'Softrate Research Staff',
      authorRef: authorRef || req.user?.id,
      coverImage: coverImage || '',
      tags: tags || [],
      readTime: calculatedReadTime,
      status: status || 'draft',
      isFeatured: !!isFeatured,
      isTrending: !!isTrending,
      publishedAt: status === 'published' ? (publishedAt || new Date()) : publishedAt,
      seo: {
        metaTitle: seo?.metaTitle || title,
        metaDescription: seo?.metaDescription || excerpt,
        canonicalUrl: seo?.canonicalUrl || '',
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create article', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const updated = store.updatePost(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Article not found' });
      return res.json(updated);
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }

    if (req.body.title && !req.body.slug && req.body.title !== post.title) {
      req.body.slug = generateSlug(req.body.title);
    }

    if (req.body.content && !req.body.readTime) {
      req.body.readTime = calculateReadTime(req.body.content);
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug accentColor');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update article', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const ok = store.deletePost(req.params.id);
      return res.json({ message: 'Article deleted successfully' });
    }

    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete article', error: error.message });
  }
};
