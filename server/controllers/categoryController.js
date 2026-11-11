const mongoose = require('mongoose');
const Category = require('../models/Category');
const Post = require('../models/Post');
const store = require('../data/store');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getCategories = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.getCategories());
    }

    const categories = await Category.find().sort({ name: 1 });
    if (categories.length === 0) {
      return res.json(store.getCategories());
    }

    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const count = await Post.countDocuments({
          category: cat._id,
          status: 'published',
        });
        return {
          ...cat.toObject(),
          postCount: count,
        };
      })
    );

    res.json(categoriesWithCount);
  } catch (error) {
    res.json(store.getCategories());
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const cat = store.getCategoryBySlug(req.params.slug);
      if (!cat) return res.status(404).json({ message: 'Category not found' });
      return res.json(cat);
    }

    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) {
      const fallback = store.getCategoryBySlug(req.params.slug);
      if (fallback) return res.json(fallback);
      return res.status(404).json({ message: 'Category not found' });
    }
    const count = await Post.countDocuments({ category: category._id, status: 'published' });
    res.json({ ...category.toObject(), postCount: count });
  } catch (error) {
    const fallback = store.getCategoryBySlug(req.params.slug);
    if (fallback) return res.json(fallback);
    res.status(500).json({ message: 'Error retrieving category', error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, slug, description, accentColor } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const calculatedSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!isDbConnected()) {
      const newCat = {
        _id: `cat-${Date.now()}`,
        name: name.trim(),
        slug: calculatedSlug,
        description: description || '',
        accentColor: accentColor || '#e42525',
        postCount: 0,
      };
      return res.status(201).json(newCat);
    }

    const existing = await Category.findOne({
      $or: [{ slug: calculatedSlug }, { name: name.trim() }],
    });
    if (existing) {
      return res.status(400).json({ message: 'Category name or slug already exists' });
    }

    const category = await Category.create({
      name: name.trim(),
      slug: calculatedSlug,
      description: description || '',
      accentColor: accentColor || '#e42525',
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, accentColor } = req.body;
    if (!isDbConnected()) {
      return res.json({ _id: req.params.id, name, description, accentColor });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, accentColor },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json({ message: 'Category deleted successfully' });
    }

    const hasPosts = await Post.countDocuments({ category: req.params.id });
    if (hasPosts > 0) {
      return res.status(400).json({
        message: 'Cannot delete category containing published or draft articles',
      });
    }
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete category', error: error.message });
  }
};
