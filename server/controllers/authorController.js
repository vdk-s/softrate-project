const Author = require('../models/Author');
const Post = require('../models/Post');

exports.getAuthors = async (req, res) => {
  try {
    const authors = await Author.find().sort({ name: 1 });
    
    // Attach published posts count for each author
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
    res.status(500).json({ message: 'Error retrieving authors', error: error.message });
  }
};

exports.createAuthor = async (req, res) => {
  try {
    const { name, role, avatar, bio } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Author name is required' });
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
    const author = await Author.findByIdAndDelete(req.params.id);
    if (!author) {
      return res.status(404).json({ message: 'Author not found' });
    }
    res.json({ message: 'Author deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting author', error: error.message });
  }
};

