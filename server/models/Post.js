const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    excerpt: {
      type: String,
      default: '',
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    author: {
      type: String,
      default: 'Softrate Engineering',
    },
    authorRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
    },
    tags: {
      type: [String],
      default: [],
    },
    readTime: {
      type: String,
      default: '5 min read',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'scheduled'],
      default: 'published',
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    seo: {
      metaTitle: {
        type: String,
        default: '',
      },
      metaDescription: {
        type: String,
        default: '',
      },
    },
  },
  { timestamps: true }
);

// Text index for search functionality
postSchema.index({ title: 'text', excerpt: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);

