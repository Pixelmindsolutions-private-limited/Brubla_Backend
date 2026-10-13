import mongoose from "mongoose";
import { Designer } from "../Models/Designer.js";
import DesignerProduct from "../Models/DesignerProduct.js";
import { getFileUrl } from "../utils/fileUtils.js";
import path from "path";
const parseBodyValue = (value) => {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};
const normalizePayload = (body) => {
  const payload = { ...body };
  for (const key of [
    "variants",
    "specifications",
    "shipping",
    "deliveryOptions",
    "tags",
    "additionalSettings",
    "mainImages",
    "productVideos",
    "creatorDetails",
    "reviews",
  ]) {
    if (payload[key] !== undefined) payload[key] = parseBodyValue(payload[key]);
  }
  if (payload.specifications && !Array.isArray(payload.specifications)) {
    payload.specifications = Object.entries(payload.specifications).map(
      ([key, value]) => ({ key, value }),
    );
  }
  if (Array.isArray(payload.specifications)) {
    payload.specifications = payload.specifications
      .map((item) => ({
        key: String(item?.key ?? "").trim(),
        value: String(item?.value ?? "").trim(),
      }))
      .filter((item) => item.key && item.value);
  }
  if (Array.isArray(payload.tags)) {
    payload.tags = payload.tags
      .flatMap((tag) => String(tag).split(","))
      .map((tag) => tag.replace(/\\?["']/g, "").trim())
      .filter(Boolean);
  }
  if (Array.isArray(payload.variants))
    payload.variants = payload.variants.map((variant) => ({
      ...variant,
      sizes: parseBodyValue(variant.sizes) || [],
      images: parseBodyValue(variant.images) || [],
    }));
  return payload;
};

const normalizeStoredMediaUrl = (url, mediaType = "images") => {
  if (typeof url !== "string") return url;
  const oldPrefix = "/uploads/products/";
  const newPrefix = `/uploads/products/${mediaType}/`;
  if (!url.includes(oldPrefix)) return url;
  const remainder = url.split(oldPrefix)[1];
  return remainder && !remainder.includes("/")
    ? url.replace(oldPrefix, newPrefix)
    : url;
};

const serializeDesignerProduct = (product) => {
  const value = product.toObject({ virtuals: true });
  if (!Array.isArray(value.specifications)) {
    value.specifications = Object.entries(value.specifications || {}).map(
      ([key, specificationValue]) => ({ key, value: specificationValue }),
    );
  }
  value.mainImages = (value.mainImages || []).map((url) => normalizeStoredMediaUrl(url));
  value.productVideos = (value.productVideos || []).map((url) =>
    normalizeStoredMediaUrl(url, "videos"),
  );
  value.variants = (value.variants || []).map((variant) => ({
    ...variant,
    images: (variant.images || []).map((url) => normalizeStoredMediaUrl(url)),
  }));
  return value;
};

const applyUploadedMedia = (payload, req) => {
  if (!Array.isArray(req.files) || !req.files.length) return payload;
  const videoUrls = [];
  const imageMap = {};
  for (const file of req.files) {
    const mediaFolder = file.mimetype.startsWith("video/")
      ? "products/videos"
      : "products/images";
    const url = getFileUrl(req, path.basename(file.path), mediaFolder);
    if (file.mimetype.startsWith("video/")) videoUrls.push(url);
    else {
      const match = file.fieldname.match(/variant_(\d+)_images/);
      if (match) (imageMap[Number(match[1])] ||= []).push(url);
    }
  }
  payload.variants = (payload.variants || []).map((variant, index) => ({
    ...variant,
    images: [...(variant.images || []), ...(imageMap[index] || [])],
  }));
  if (videoUrls.length)
    payload.productVideos = [...(payload.productVideos || []), ...videoUrls];
  return payload;
};
const canAccessProduct = (product, req) =>
  req.user?.role === "admin" || product.designerId?.toString() === req.user?.id;
export const createDesignerCatalogProduct = async (req, res) => {
  try {
    if (!["designer", "admin"].includes(req.user?.role)) {
      return res
        .status(403)
        .json({
          success: false,
          message: "Only designers or admins can create designer products",
        });
    }
    const designerId =
      req.user.role === "admin" ? req.body.designerId : req.user.id;
    if (!designerId) {
      return res
        .status(400)
        .json({
          success: false,
          message: "designerId is required for admin-created products",
        });
    }
    const designer = await Designer.findById(designerId);
    if (!designer)
      return res
        .status(404)
        .json({ success: false, message: "Designer not found" });
    const payload = applyUploadedMedia(normalizePayload(req.body), req);
    const product = new DesignerProduct({
      ...payload,
      designerId: designer._id,
      creatorId: designer._id,
      createdBy: "designer",
      creatorDetails: {
        name: designer.name || "Designer",
        profileImage: designer.profileImage || "",
        role: "designer",
        brandName: designer.brandName || designer.name || "",
        ...(payload.creatorDetails || {}),
      },
    });
    await product.save();
    return res
      .status(201)
      .json({ success: true, message: "Designer product created", product });
  } catch (error) {
    console.error("createDesignerCatalogProduct error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const getAllDesignerCatalogProducts = async (req, res) => {
  try {
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, Number.parseInt(req.query.limit, 10) || 20),
    );
    const query = req.user?.role === "admin" ? {} : { designerId: req.user.id };
    if (req.query.search)
      query.name = { $regex: req.query.search, $options: "i" };
    if (req.query.status) query.approvalStatus = req.query.status;
    const [products, total] = await Promise.all([
      DesignerProduct.find(query)
        .populate("categoryId", "name")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      DesignerProduct.countDocuments(query),
    ]);
    return res
      .status(200)
      .json({
        success: true,
        count: products.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        products: products.map(serializeDesignerProduct),
      });
  } catch (error) {
    console.error("getAllDesignerCatalogProducts error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getDesignerCatalogProductById = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    const product = await DesignerProduct.findById(req.params.id).populate(
      "categoryId",
      "name",
    );
    if (!product || !canAccessProduct(product, req))
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    return res
      .status(200)
      .json({ success: true, product: serializeDesignerProduct(product) });
  } catch (error) {
    console.error("getDesignerCatalogProductById error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const updateDesignerCatalogProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    const product = await DesignerProduct.findById(req.params.id);
    if (!product || !canAccessProduct(product, req))
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    const payload = applyUploadedMedia(normalizePayload(req.body), req);
    for (const [key, value] of Object.entries(payload)) {
      if (
        ![
          "_id",
          "__v",
          "designerId",
          "creatorId",
          "createdBy",
          "createdAt",
          "updatedAt",
          "approvalStatus",
          "rejectionReason",
        ].includes(key)
      )
        product.set(key, value);
    }
    await product.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Designer product updated",
        product: serializeDesignerProduct(product),
      });
  } catch (error) {
    console.error("updateDesignerCatalogProduct error:", error);
    return res.status(400).json({ success: false, message: error.message });
  }
};
export const deleteDesignerCatalogProduct = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id))
      return res
        .status(400)
        .json({ success: false, message: "Invalid product id" });
    const product = await DesignerProduct.findById(req.params.id);
    if (!product || !canAccessProduct(product, req))
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    await product.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: "Designer product deleted" });
  } catch (error) {
    console.error("deleteDesignerCatalogProduct error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
