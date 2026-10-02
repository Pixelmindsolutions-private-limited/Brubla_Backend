import mongoose from 'mongoose';
//hina
const sizeChartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    unique: true, // Ek product ka ek hi size chart
  },
  productName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: '',
  },
  // Dynamic measurement columns (e.g., ["Chest", "Shoulder", "Length", "Sleeve"])
  measurements: [{
    type: String,
    required: true,
  }],
  // Size rows with dynamic values
  sizes: [{
    size: {
      type: String,
      required: true, // e.g., "S", "M", "L", "XL" OR "28", "30" OR "Free Size"
    },
    values: {
      type: Map,
      of: String, // { "Chest": "38", "Shoulder": "17", ... }
    },
  }],
  notes: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const SizeChart = mongoose.model('SizeChart', sizeChartSchema);
export default SizeChart;