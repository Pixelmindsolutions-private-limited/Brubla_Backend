import SizeChart from '../Models/SizeChart.js';
import Product from '../Models/Product.js';

// ========== CREATE ==========
export const createSizeChart = async (req, res) => {
  try {
    const { productId, productName, category, measurements, sizes, notes } = req.body;

    if (!productId || !measurements?.length || !sizes?.length) {
      return res.status(400).json({
        success: false,
        message: 'productId, measurements, and sizes are required',
      });
    }

    // Check if size chart already exists for this product
    const existing = await SizeChart.findOne({ productId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Size chart already exists for this product',
      });
    }

    const sizeChart = await SizeChart.create({
      productId,
      productName: productName || '',
      category: category || '',
      measurements,
      sizes,
      notes: notes || '',
    });

    res.status(201).json({
      success: true,
      message: 'Size chart created successfully',
      data: sizeChart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== GET ALL ==========
export const getAllSizeCharts = async (req, res) => {
  try {
    const sizeCharts = await SizeChart.find()
      .populate('productId', 'name brand categoryId')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: sizeCharts.length,
      data: sizeCharts,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== GET BY ID ==========
export const getSizeChartById = async (req, res) => {
  try {
    const sizeChart = await SizeChart.findById(req.params.id)
      .populate('productId', 'name brand categoryId');

    if (!sizeChart) {
      return res.status(404).json({ success: false, message: 'Size chart not found' });
    }

    res.status(200).json({ success: true, data: sizeChart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== GET BY PRODUCT ID (for customer-facing) ==========
export const getSizeChartByProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const sizeChart = await SizeChart.findOne({ productId, isActive: true });

    if (!sizeChart) {
      return res.status(404).json({ success: false, message: 'No size chart found for this product' });
    }

    res.status(200).json({ success: true, data: sizeChart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== UPDATE ==========
export const updateSizeChart = async (req, res) => {
  try {
    const { id } = req.params;
    const { productName, category, measurements, sizes, notes, isActive } = req.body;

    const sizeChart = await SizeChart.findById(id);
    if (!sizeChart) {
      return res.status(404).json({ success: false, message: 'Size chart not found' });
    }

    if (productName !== undefined) sizeChart.productName = productName;
    if (category !== undefined) sizeChart.category = category;
    if (measurements !== undefined) sizeChart.measurements = measurements;
    if (sizes !== undefined) sizeChart.sizes = sizes;
    if (notes !== undefined) sizeChart.notes = notes;
    if (isActive !== undefined) sizeChart.isActive = isActive;

    await sizeChart.save();

    res.status(200).json({
      success: true,
      message: 'Size chart updated successfully',
      data: sizeChart,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== DELETE ==========
export const deleteSizeChart = async (req, res) => {
  try {
    const sizeChart = await SizeChart.findByIdAndDelete(req.params.id);
    if (!sizeChart) {
      return res.status(404).json({ success: false, message: 'Size chart not found' });
    }
    res.status(200).json({ success: true, message: 'Size chart deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== FETCH AVAILABLE SIZES FOR PRODUCT (Helper) ==========
export const getProductSizes = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Extract unique sizes from all variants
    const sizesSet = new Set();
    product.variants?.forEach((variant) => {
      variant.sizes?.forEach((size) => {
        if (size.size) sizesSet.add(size.size);
      });
    });

    const sizes = Array.from(sizesSet).sort((a, b) => {
      // Sort: S, M, L, XL first, then numbers
      const order = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
      const aIdx = order.indexOf(a.toUpperCase());
      const bIdx = order.indexOf(b.toUpperCase());
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.localeCompare(b, undefined, { numeric: true });
    });

    res.status(200).json({
      success: true,
      data: {
        productId,
        productName: product.name,
        brand: product.brand,
        category: product.categoryId?.name || '',
        sizes,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};