// import mongoose from 'mongoose';

// // Review Schema
// const reviewSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   userName: {
//     type: String,
//     required: true
//   },
//   userImage: {
//     type: String,
//     default: ''
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   description: {
//     type: String,
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Size Schema
// const sizeSchema = new mongoose.Schema({
//   size: {
//     type: String,
//     enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom'],
//     required: true
//   },
//   stock: {
//     type: Number,
//     required: true,
//     default: 0,
//     min: 0
//   }
// });

// // Color Variant Schema
// const colorVariantSchema = new mongoose.Schema({
//   color: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   price: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   discountPrice: {
//     type: Number,
//     default: null,
//     min: 0
//   },
//   sizes: [sizeSchema],
//   images: [{
//     type: String
//   }],
//   sku: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true
//   },
//   isActive: {
//     type: Boolean,
//     default: true
//   }
// });

// // Main Product Schema
// const productSchema = new mongoose.Schema({
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   description: {
//     type: String,
//     required: true
//   },
  
//   // Category Information
//   categoryId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true
//   },
//   subcategoryId: {
//     type: mongoose.Schema.Types.ObjectId,
//     required: true
//   },
//   subcategoryName: {
//     type: String,
//     required: true
//   },
  
//   // Color Variants
//   variants: [colorVariantSchema],
  
//   // Main Images (first image from each variant)
//   mainImages: [{
//     type: String
//   }],
  
//   // Media
//   sizeGuide: [{
//     type: String
//   }],
  
//   // Pricing (derived)
//   displayPrice: {
//     type: Number,
//     default: 0
//   },
//   displayActualPrice: {
//     type: Number,
//     default: 0
//   },
//   maxDiscount: {
//     type: Number,
//     default: 0
//   },
//    exclusiveProduct: {
//     type: Boolean,
//     default: false,
//     index: true  
//   },
  
//   // Creator Information
//   createdBy: {
//     type: String,
//     enum: ['admin', 'designer', 'tailor', 'Stylist'],
//     required: true
//   },
//   creatorId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   creatorDetails: {
//     name: String,
//     profileImage: String,
//     role: String,
//     brandName: String,
//     shopName: String
//   },
  
//   // Approval Workflow
//   approvalStatus: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected', 'not_required'],
//     default: 'not_required'
//   },
//   rejectionReason: {
//     type: String
//   },
  
//   // Reviews
//   reviews: [reviewSchema],
//   averageRating: {
//     type: Number,
//     default: 0
//   },

//   // Status
//   isActive: {
//     type: Boolean,
//     default: true
//   },
  
//   // Tags
//   tags: [{
//     type: String,
//     trim: true
//   }]
// }, {
//   timestamps: true
// });


// // Pre-save middleware
// productSchema.pre('save', function(next) {
//   // Calculate display prices
//   if (this.variants && this.variants.length > 0) {
//     let lowestPrice = Infinity;
//     let lowestActualPrice = Infinity;
//     let maxDiscountPercent = 0;
//     const mainImagesArray = [];
    
//     this.variants.forEach(variant => {
//       const currentPrice = variant.discountPrice || variant.price;
//       if (currentPrice < lowestPrice) {
//         lowestPrice = currentPrice;
//         lowestActualPrice = variant.price;
//       }
      
//       if (variant.discountPrice && variant.discountPrice < variant.price) {
//         const discount = Math.round(((variant.price - variant.discountPrice) / variant.price) * 100);
//         if (discount > maxDiscountPercent) maxDiscountPercent = discount;
//       }
      
//       // Generate SKU
//       if (!variant.sku) {
//         const productPrefix = this.name.substring(0, 3).toUpperCase();
//         const colorPrefix = variant.color.substring(0, 3).toUpperCase();
//         variant.sku = `${productPrefix}-${colorPrefix}-${Date.now()}`;
//       }
      
//       // Collect main images
//       if (variant.images && variant.images.length > 0) {
//         mainImagesArray.push(variant.images[0]);
//       }
//     });
    
//     this.displayPrice = lowestPrice;
//     this.displayActualPrice = lowestActualPrice;
//     this.maxDiscount = maxDiscountPercent;
//     this.mainImages = mainImagesArray;
//   }
  
//   // Set approval status for new products
//   if (this.isNew) {
//     if (this.createdBy === 'admin') {
//       this.approvalStatus = 'not_required';
//       this.isActive = true;
//     } else {
//       this.approvalStatus = 'pending';
//       this.isActive = false;
//     }
//   }
  
//   next();
// });

// // Update average rating
// productSchema.pre('save', function(next) {
//   if (this.reviews && this.reviews.length > 0) {
//     const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
//     this.averageRating = sum / this.reviews.length;
//   } else {
//     this.averageRating = 0;
//   }
//   next();
// });

// // Instance Methods
// productSchema.methods.reduceStock = function(variantIndex, sizeIndex, quantity = 1) {
//   const variant = this.variants[variantIndex];
//   if (!variant) return false;
//   const sizeObj = variant.sizes[sizeIndex];
//   if (sizeObj && sizeObj.stock >= quantity) {
//     sizeObj.stock -= quantity;
//     return true;
//   }
//   return false;
// };

// // Virtuals
// productSchema.virtual('availableColors').get(function() {
//   if (!this.variants || !Array.isArray(this.variants)) return [];
//   return [...new Set(this.variants.filter(v => v && v.stock > 0).map(v => v.color))];
// });

// productSchema.virtual('availableSizes').get(function() {
//   if (!this.variants || !Array.isArray(this.variants)) return [];
//   const sizesSet = new Set();
//   this.variants.forEach(variant => {
//     if (variant && variant.sizes && Array.isArray(variant.sizes)) {
//       variant.sizes.forEach(size => {
//         if (size && size.stock > 0) sizesSet.add(size.size);
//       });
//     }
//   });
//   return [...sizesSet];
// });

// productSchema.virtual('totalStock').get(function() {
//   if (!this.variants || !Array.isArray(this.variants)) return 0;
//   let total = 0;
//   this.variants.forEach(variant => {
//     if (variant && variant.sizes && Array.isArray(variant.sizes)) {
//       variant.sizes.forEach(size => {
//         if (size && size.stock) total += size.stock;
//       });
//     }
//   });
//   return total;
// });

// productSchema.set('toJSON', { virtuals: true });
// productSchema.set('toObject', { virtuals: true });

// const Product = mongoose.model('Product', productSchema);
// export default Product;

import mongoose from 'mongoose';
import { calculateTotalStock } from '../utils/inventoryUtils.js';

// ==================== REVIEW SCHEMA ====================
const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  userImage: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// ==================== SIZE SCHEMA (stock only) ====================
const sizeSchema = new mongoose.Schema({
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'Custom'],
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  }
});

// ==================== COLOR VARIANT SCHEMA (price here) ====================
const colorVariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  discountPrice: {
    type: Number,
    default: null,
    min: 0
  },
  sizes: [sizeSchema],
  images: [{ type: String }],
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// ==================== SPECIFICATIONS SCHEMA ====================
const specificationsSchema = new mongoose.Schema({
  fabric:   { type: String, trim: true, default: '' },
  color:    { type: String, trim: true, default: '' },
  pattern:  { type: String, trim: true, default: '' },
  fit:      { type: String, trim: true, default: '' },
  sleeve:   { type: String, trim: true, default: '' },
  neck:     { type: String, trim: true, default: '' },
  occasion: { type: String, trim: true, default: '' },
  washCare: { type: String, trim: true, default: '' },
  length:   { type: String, trim: true, default: '' }
}, { _id: false });

// ==================== SHIPPING SCHEMA ====================
const shippingSchema = new mongoose.Schema({
  weight: { type: Number, default: 0, min: 0 }, // grams
  length: { type: Number, default: 0, min: 0 }, // cm
  width:  { type: Number, default: 0, min: 0 }, // cm
  height: { type: Number, default: 0, min: 0 }  // cm
}, { _id: false });

// ==================== DELIVERY OPTIONS SCHEMA ====================
const deliveryOptionsSchema = new mongoose.Schema({
  availablePincodes: [{ type: String, trim: true }],
  returnPolicy:      { type: String, trim: true, default: '' }
}, { _id: false });

// ==================== ADDITIONAL SETTINGS (extensible) ====================
const additionalSettingSchema = new mongoose.Schema({
  key:   { type: String, required: true, trim: true },
  label: { type: String, required: true, trim: true },
  value: { type: Boolean, default: false }
}, { _id: false });

// ==================== MAIN PRODUCT SCHEMA ====================
const productSchema = new mongoose.Schema({
  // ========== 1. BASIC INFORMATION ==========
  name: { type: String, required: true, trim: true },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  subcategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  subcategoryName: { type: String, required: true },
  brand: { type: String, trim: true, default: '' },
  gender: {
    type: String,
    enum: ['Men', 'Women', 'Unisex', 'Kids', 'Boys', 'Girls', ''],
    default: 'Unisex'
  },
  isActive: { type: Boolean, default: true },
  exclusiveProduct: { type: Boolean, default: false, index: true },

  // ========== 2. DESCRIPTION ==========
  shortDescription: { type: String, trim: true, default: '' },
  description: { type: String, required: true },

  // ========== 3. PRODUCT SPECIFICATIONS ==========
  specifications: {
    type: specificationsSchema,
    default: () => ({})
  },

  // ========== 4. PRODUCT MEDIA (IMAGES + VIDEOS) ==========
  mainImages: [{ type: String }],      // derived: first image of each variant
  productVideos: [{ type: String }],   // ✅ NEW: product videos

  // ========== 5. VARIANTS (price per color) ==========
  variants: [colorVariantSchema],
  totalStock: { type: Number, default: 0, min: 0 },

  // Inventory metadata; variant size stock remains the source of truth.
  lowStockThreshold: { type: Number, min: 0, default: undefined },
  warehouse: { type: String, trim: true, default: undefined },
  barcode: { type: String, trim: true, default: undefined },

  // ========== 7. SHIPPING ==========
  shipping: {
    type: shippingSchema,
    default: () => ({})
  },

  // ========== 8. DELIVERY OPTIONS ==========
  deliveryOptions: {
    type: deliveryOptionsSchema,
    default: () => ({})
  },

  // ========== 9. TAGS ==========
  tags: [{ type: String, trim: true }],

  // ========== 10. ADDITIONAL SETTINGS ==========
  additionalSettings: {
    type: [additionalSettingSchema],
    default: [
      { key: 'newArrival',        label: 'New Arrival',        value: false },
      { key: 'featured',          label: 'Featured',           value: false },
      { key: 'returnable',        label: 'Returnable',         value: false },
      { key: 'bestSeller',        label: 'Best Seller',        value: false },
      { key: 'exchangeAvailable', label: 'Exchange Available', value: false }
    ]
  },

  // ========== PRICING (derived) ==========
  displayPrice:       { type: Number, default: 0 },
  displayActualPrice: { type: Number, default: 0 },
  maxDiscount:        { type: Number, default: 0 },

  // ========== CREATOR INFO ==========
  createdBy: {
    type: String,
    enum: ['admin', 'designer', 'tailor', 'Stylist'],
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  creatorDetails: {
    name:         String,
    profileImage: String,
    role:         String,
    brandName:    String,
    shopName:     String
  },

  // ========== APPROVAL ==========
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'not_required'],
    default: 'not_required'
  },
  rejectionReason: { type: String },

  // ========== REVIEWS ==========
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 }

}, {
  timestamps: true,
  optimisticConcurrency: true,
});

// ==================== INDEXES ====================
productSchema.index({ brand: 1 });
productSchema.index({ gender: 1 });
productSchema.index({ exclusiveProduct: 1, isActive: 1 });
productSchema.index({ 'specifications.fabric': 1 });
productSchema.index({ 'specifications.occasion': 1 });

// ==================== SKU GENERATOR (BRUB format) ====================
const generateUniqueSKU = async (productName, color, usedNumbers = new Set()) => {
  const BRAND_PREFIX = 'BRUB';
  const ProductModel = mongoose.model('Product');

  const productPrefix = (productName || 'XX')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 2)
    .toUpperCase()
    .padEnd(2, 'X');

  const colorPrefix = (color || 'X')
    .replace(/[^a-zA-Z]/g, '')
    .substring(0, 1)
    .toUpperCase() || 'X';

  const basePrefix = `${BRAND_PREFIX}${productPrefix}${colorPrefix}`;

  // Find highest existing number across all BRUB SKUs
  const existingProducts = await ProductModel.find({
    'variants.sku': { $regex: `^${BRAND_PREFIX}` }
  }).select('variants.sku').lean();

  let maxNumber = 0;
  existingProducts.forEach(p => {
    (p.variants || []).forEach(v => {
      if (v.sku && v.sku.startsWith(BRAND_PREFIX)) {
        const numPart = v.sku.replace(/^[A-Z]+/, '');
        const num = parseInt(numPart, 10);
        if (!isNaN(num) && num > maxNumber) maxNumber = num;
      }
    });
  });

  // Also check numbers already used in this save batch
  usedNumbers.forEach(n => { if (n > maxNumber) maxNumber = n; });

  let nextNumber = maxNumber + 1;
  let sku = `${basePrefix}${String(nextNumber).padStart(3, '0')}`;

  // Ensure uniqueness
  let exists = await ProductModel.findOne({ 'variants.sku': sku }).lean();
  while (exists || usedNumbers.has(nextNumber)) {
    nextNumber++;
    sku = `${basePrefix}${String(nextNumber).padStart(3, '0')}`;
    exists = await ProductModel.findOne({ 'variants.sku': sku }).lean();
  }

  return { sku, number: nextNumber };
};

// ==================== PRE-SAVE: pricing + SKU + approval ====================
productSchema.pre('save', async function(next) {
  try {
    this.totalStock = calculateTotalStock(this);
    if (this.variants && this.variants.length > 0) {
      let lowestPrice = Infinity;
      let lowestActualPrice = Infinity;
      let maxDiscountPercent = 0;
      const mainImagesArray = [];
      const usedNumbers = new Set();

      for (const variant of this.variants) {
        const currentPrice = variant.discountPrice || variant.price;

        if (currentPrice < lowestPrice) {
          lowestPrice = currentPrice;
          lowestActualPrice = variant.price;
        }

        if (variant.discountPrice && variant.discountPrice < variant.price) {
          const discount = Math.round(
            ((variant.price - variant.discountPrice) / variant.price) * 100
          );
          if (discount > maxDiscountPercent) maxDiscountPercent = discount;
        }

        // ✅ Auto-generate SKU if missing
        if (!variant.sku) {
          const result = await generateUniqueSKU(this.name, variant.color, usedNumbers);
          variant.sku = result.sku;
          usedNumbers.add(result.number);
        }

        if (variant.images && variant.images.length > 0) {
          mainImagesArray.push(variant.images[0]);
        }
      }

      this.displayPrice = lowestPrice === Infinity ? 0 : lowestPrice;
      this.displayActualPrice = lowestActualPrice === Infinity ? 0 : lowestActualPrice;
      this.maxDiscount = maxDiscountPercent;
      this.mainImages = mainImagesArray;
    }

    if (this.isNew) {
      if (this.createdBy === 'admin') {
        this.approvalStatus = 'not_required';
        this.isActive = true;
      } else {
        this.approvalStatus = 'pending';
        this.isActive = false;
      }
    }

    next();
  } catch (err) {
    console.error('pre-save error:', err);
    next(err);
  }
});

// ==================== PRE-SAVE: average rating ====================
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
  } else {
    this.averageRating = 0;
  }
  next();
});

// ==================== INSTANCE METHODS ====================
productSchema.methods.reduceStock = function(variantIndex, sizeIndex, quantity = 1) {
  const variant = this.variants[variantIndex];
  if (!variant) return false;
  const sizeObj = variant.sizes[sizeIndex];
  if (sizeObj && sizeObj.stock >= quantity) {
    sizeObj.stock -= quantity;
    return true;
  }
  return false;
};

// ==================== VIRTUALS ====================
productSchema.virtual('availableColors').get(function() {
  if (!this.variants || !Array.isArray(this.variants)) return [];
  return [...new Set(
    this.variants
      .filter(v => v && v.sizes && v.sizes.some(s => s.stock > 0))
      .map(v => v.color)
  )];
});

productSchema.virtual('availableSizes').get(function() {
  if (!this.variants || !Array.isArray(this.variants)) return [];
  const sizesSet = new Set();
  this.variants.forEach(variant => {
    if (variant && variant.sizes && Array.isArray(variant.sizes)) {
      variant.sizes.forEach(size => {
        if (size && size.stock > 0) sizesSet.add(size.size);
      });
    }
  });
  return [...sizesSet];
});

productSchema.virtual('isExclusive').get(function() {
  return this.exclusiveProduct === true;
});

productSchema.virtual('settingsMap').get(function() {
  if (!this.additionalSettings) return {};
  return this.additionalSettings.reduce((acc, s) => {
    acc[s.key] = s.value;
    return acc;
  }, {});
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
