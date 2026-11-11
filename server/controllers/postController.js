const Post = require('../models/Post');
const Category = require('../models/Category');

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

    // Status filter
    if (status !== 'all') {
      query.status = status;
    }

    // Category filter (slug or ObjectId)
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

    // Tag filter
    if (tag) {
      query.tags = { $in: [new RegExp(tag, 'i')] };
    }

    // Keyword search
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

    res.json({
      posts,
      totalPosts,
      totalPages: Math.ceil(totalPosts / Number(limit)) || 1,
      currentPage: Number(page),
      limit: Number(limit),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error: error.message });
  }
};

exports.getFeaturedPosts = async (req, res) => {
  try {
    // 1 primary featured + 2 secondary featured
    let posts = await Post.find({ status: 'published', isFeatured: true })
      .populate('category', 'name slug accentColor')
      .populate('authorRef', 'name avatar role')
      .sort('-publishedAt')
      .limit(3);

    // Fallback if not enough flagged as featured
    if (posts.length < 3) {
      const needed = 3 - posts.length;
      const existingIds = posts.map((p) => p._id);
      const additional = await Post.find({
        status: 'published',
        _id: { $nin: existingIds },
      })
        .populate('category', 'name slug accentColor')
        .populate('authorRef', 'name avatar role')
        .sort('-publishedAt')
        .limit(needed);
      posts = [...posts, ...additional];
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured posts', error: error.message });
  }
};

exports.getTrendingPosts = async (req, res) => {
  try {
    let posts = await Post.find({ status: 'published', isTrending: true })
      .populate('category', 'name slug accentColor')
      .sort('-views -publishedAt')
      .limit(5);

    // Fallback to top views
    if (posts.length < 5) {
      const existingIds = posts.map((p) => p._id);
      const fallback = await Post.find({
        status: 'published',
        _id: { $nin: existingIds },
      })
        .populate('category', 'name slug accentColor')
        .sort('-views -publishedAt')
        .limit(5 - posts.length);
      posts = [...posts, ...fallback];
    }

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending posts', error: error.message });
  }
};

exports.getPostBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOneAndUpdate(
      { slug: slug.toLowerCase() },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('category', 'name slug description accentColor')
      .populate('authorRef', 'name avatar role bio');

    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }

    // Fetch related articles (same category or shared tags)
    const relatedPosts = await Post.find({
      status: 'published',
      _id: { $ne: post._id },
      $or: [
        { category: post.category?._id },
        { tags: { $in: post.tags || [] } },
      ],
    })
      .populate('category', 'name slug accentColor')
      .limit(3)
      .select('title slug excerpt coverImage readTime publishedAt author category');

    // Fetch Next and Previous posts
    const prevPost = await Post.findOne({
      status: 'published',
      publishedAt: { $lt: post.publishedAt },
    })
      .sort('-publishedAt')
      .select('title slug category')
      .populate('category', 'name slug');

    const nextPost = await Post.findOne({
      status: 'published',
      publishedAt: { $gt: post.publishedAt },
    })
      .sort('publishedAt')
      .select('title slug category')
      .populate('category', 'name slug');

    res.json({
      post,
      relatedPosts,
      prevPost,
      nextPost,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving article', error: error.message });
  }
};

exports.createPost = async (req, res) => {
  try {
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      author,
      tags,
      readTime,
      status,
      isFeatured,
      isTrending,
      publishedAt,
      seo,
    } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: 'Title, content, and category are required' });
    }

    let postSlug = slug ? generateSlug(slug) : generateSlug(title);
    const existingSlug = await Post.findOne({ slug: postSlug });
    if (existingSlug) {
      postSlug = `${postSlug}-${Date.now().toString().slice(-4)}`;
    }

    const calculatedReadTime = readTime || calculateReadTime(content);

    const post = await Post.create({
      title,
      slug: postSlug,
      excerpt: excerpt || content.slice(0, 160).replace(/[#*`_]/g, '') + '...',
      content,
      coverImage: coverImage || '',
      category,
      author: author || 'Softrate Engineering',
      tags: Array.isArray(tags) ? tags : typeof tags === 'string' ? tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      readTime: calculatedReadTime,
      status: status || 'published',
      isFeatured: Boolean(isFeatured),
      isTrending: Boolean(isTrending),
      publishedAt: publishedAt || Date.now(),
      seo: {
        metaTitle: seo?.metaTitle || title,
        metaDescription: seo?.metaDescription || excerpt || '',
      },
    });

    const populated = await Post.findById(post._id).populate('category', 'name slug');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }

    const updates = { ...req.body };

    if (updates.title && !updates.slug && updates.title !== post.title) {
      updates.slug = generateSlug(updates.title);
    } else if (updates.slug) {
      updates.slug = generateSlug(updates.slug);
    }

    if (updates.content && !updates.readTime) {
      updates.readTime = calculateReadTime(updates.content);
    }

    if (updates.tags && typeof updates.tags === 'string') {
      updates.tags = updates.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }

    const updated = await Post.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    }).populate('category', 'name slug');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
};

