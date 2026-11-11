const mongoose = require('mongoose');
const Author = require('../models/Author');
const Post = require('../models/Post');
const store = require('../data/store');

const isDbConnected = () => mongoose.connection.readyState === 1;

exports.getAuthors = async (req, res) => {
  try {
    if (!isDbConnected()) {
      return res.json(store.getAuthors());
    }

    const authors = await Author.find().sort({ name: 1 });
    if (authors.length === 0) {
      return res.json(store.getAuthors());
    }

    const authorsWithCount = await Promise.all(
      authors.map(async (author) => {
        const count = await Post.countDocuments({
          $or: [
            { authorRef: author._id },
            { author: new RegExp(author.name, 'i') },
          ],
          status: 'published',
        });
        return {
          ...author.toObject(),
          postCount: count,
        };
      })
    );

    res.json(authorsWithCount);
  } catch (error) {
    res.json(store.getAuthors());
  }
};

exports.getAuthorById = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const a = store.getAuthorById(req.params.id);
      if (!a) return res.status(404).json({ message: 'Author not found' });
      return res.json(a);
    }

    const author = await Author.findById(req.params.id);
    if (!author) {
      const a = store.getAuthorById(req.params.id);
      if (a) return res.json(a);
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json(author);
  } catch (error) {
    const a = store.getAuthorById(req.params.id);
    if (a) return res.json(a);
    res.status(500).json({ message: 'Error retrieving author', error: error.message });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const { name, role, avatar, bio } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Author name is required' });
    }

    if (!isDbConnected()) {
      const newAuth = store.createAuthor(req.body);
      return res.status(201).json(newAuth);
    }

    const author = await Author.create({
      name: name.trim(),
      role: role || 'Technical Researcher',
      avatar: avatar || '',
      bio: bio || '',
    });

    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ message: 'Error creating author profile', error: error.message });
  }
};

exports.updateAuthor = async (req, res) => {
  try {
    if (!isDbConnected()) {
      const updated = store.updateAuthor(req.params.id, req.body);
      if (!updated) return res.status(404).json({ message: 'Author not found' });
      return res.json(updated);
    }

    const { name, role, avatar, bio } = req.body;
    const author = await Author.findById(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }

    if (name) author.name = name.trim();
    if (role !== undefined) author.role = role;
    if (avatar !== undefined) author.avatar = avatar;
    if (bio !== undefined) author.bio = bio;

    await author.save();
    res.json(author);
  } catch (error) {
    res.status(500).json({ message: 'Error updating author', error: error.message });
  }
};

exports.deleteAuthor = async (req, res) => {
  try {
    if (!isDbConnected()) {
      store.deleteAuthor(req.params.id);
      return res.json({ message: 'Author deleted successfully' });
    }

    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting author', error: error.message });
  }
};
