import mongoose from "mongoose";//hina

const stockHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    variantId: { type: mongoose.Schema.Types.ObjectId, required: true },
    size: { type: String, required: true },
    previousQuantity: { type: Number, required: true },
    changedQuantity: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    changeType: {
      type: String,
      enum: [
        "PRODUCT_CREATED",
        "ORDER_PLACED",
        "ORDER_CANCELLED",
        "STOCK_ADDED",
        "STOCK_REMOVED",
      ],
      required: true,
    },
    reason: { type: String, default: "" },
    referenceId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

stockHistorySchema.index({ productId: 1, createdAt: -1 });
export default mongoose.model("StockHistory", stockHistorySchema);
