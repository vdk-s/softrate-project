const mongoose = require('mongoose');
const Post = require('../models/Post');
const Category = require('../models/Category');
const store = require('../data/store');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getDashboardStats = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.getStats());
    }

    const [totalArticles, publishedCount, draftCount, scheduledCount, categories] =
      await Promise.all([
        Post.countDocuments(),
        Post.countDocuments({ status: 'published' }),
        Post.countDocuments({ status: 'draft' }),
        Post.countDocuments({ status: 'scheduled' }),
        Category.find().select('name slug'),
      ]);

    const viewsAgg = await Post.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } },
    ]);
    const totalViews = viewsAgg[0]?.totalViews || 0;

    const categoryBreakdown = await Promise.all(
      categories.map(async (cat) => {
        const count = await Post.countDocuments({ category: cat._id });
        return {
          name: cat.name,
          slug: cat.slug,
          count,
        };
      })
    );

    const recentPosts = await Post.find()
      .populate('category', 'name slug')
      .sort('-createdAt')
      .limit(5)
      .select('title slug status views publishedAt createdAt category');

    res.json({
      totalArticles,
      publishedCount,
      draftCount,
      scheduledCount,
      totalViews,
      categoryBreakdown,
      recentPosts,
    });
  } catch (error) {
    res.json(store.getStats());
  }
};
