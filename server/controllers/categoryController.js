const Category = require('../models/Category');
const Post = require('../models/Post');

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    
    // Attach post count to each category
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
    res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
  }
};

exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug.toLowerCase() });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const count = await Post.countDocuments({ category: category._id, status: 'published' });
    res.json({ ...category.toObject(), postCount: count });
  } catch (error) {
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
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, accentColor } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) category.name = name.trim();
    if (description !== undefined) category.description = description;
    if (accentColor) category.accentColor = accentColor;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const postCount = await Post.countDocuments({ category: req.params.id });
    if (postCount > 0) {
      return res.status(400).json({
        message: `Cannot delete category: ${postCount} article(s) are assigned to it.`,
      });
    }
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

