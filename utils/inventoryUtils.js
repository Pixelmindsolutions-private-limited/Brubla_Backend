export const calculateTotalStock = (product) =>
  (product?.variants || []).reduce(
    (total, variant) =>
      total + (variant?.sizes || []).reduce((sum, size) => sum + Math.max(0, Number(size?.stock) || 0), 0),
    0,
  );

export const getStockStatus = (stock, threshold = 5) => {
  const quantity = Number(stock) || 0;
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= threshold) return "Low Stock";
  return "Available";
};

export const serializeStockProduct = (product) => {
  const variants = (product.variants || []).map((variant) => ({
    variantId: variant._id,
    color: variant.color,
    sku: variant.sku || "",
    sizes: (variant.sizes || []).map((size) => ({
      sizeId: size._id,
      size: size.size,
      quantity: Number(size.stock) || 0,
    })),
  }));
  const totalStock = calculateTotalStock(product);
  const reserved = 0;
  return {
    productId: product._id,
    productName: product.name || "",
    name: product.name || "",
    sku: variants.map((variant) => variant.sku).filter(Boolean).join(", "),
    barcode: product.barcode || "",
    category: product.categoryId?.name || "",
    categoryId: product.categoryId?._id || product.categoryId || null,
    subcategory: product.subcategoryName || product.subcategoryId?.name || "",
    subcategoryId: product.subcategoryId?._id || product.subcategoryId || null,
    totalStock,
    inStock: totalStock,
    reserved,
    availableStock: totalStock - reserved,
    stockStatus: getStockStatus(totalStock, product.lowStockThreshold ?? 5),
    status: getStockStatus(totalStock, product.lowStockThreshold ?? 5),
    lowStockThreshold: product.lowStockThreshold ?? null,
    warehouse: product.warehouse || null,
    variants,
  };
};
