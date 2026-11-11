const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      default: '',
    },
    accentColor: {
      type: String,
      default: '#e42525', // Zoho signature red accent default
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);

