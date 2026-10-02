// models/Collection.js
import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    unique: true
  },
  tag: {
    type: String,
    required: [true, 'Tag is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
    default: null
  },

  // ✅ NEW FIELDS
  type: {
    type: String,
    enum: ['Flash Sale', 'Seasonal Sale', 'New Arrivals', 'Trending', 'Custom Collection'],
    default: 'Custom Collection'
  },
  status: {
    type: String,
    enum: ['Draft', 'Scheduled', 'Active', 'Inactive', 'Expired'],
    default: 'Active'
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },

  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Collection = mongoose.model('Collection', collectionSchema);
export default Collection;