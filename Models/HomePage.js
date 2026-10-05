// Models/HomePage.js
import mongoose from "mongoose";

// Hero Section Schema
const heroSectionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["image", "video", "youtube"],
      required: true,
    },
    filename: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      required: true,
    },
    deviceType: {
      type: String,
      enum: ["mobile", "desktop"],
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    redirectionLink: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
const PhilosophySectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);
// Banner Section Schema
const bannerSectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      trim: true,
    },
    buttonText: {
      type: String,
      default: "Shop Now",
    },
    image: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    redirectionLink: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);
const exclusiveSectionSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    img: {
      type: String,
      required: true,
      trim: true,
    },
    redirectionLink: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

// Homepage Collections Schema
const homepageCollectionSchema = new mongoose.Schema({
  collectionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Collection",
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Main Home Page Schema
const homePageSchema = new mongoose.Schema(
  {
    heroSections: [heroSectionSchema],
    banners: [bannerSectionSchema],
    exclusive: {
      type: exclusiveSectionSchema,
      default: null,
    },
    philosophy: {
      type: PhilosophySectionSchema,
      default: null,
    },
    homepageCollections: [homepageCollectionSchema],
  },
  {
    timestamps: true,
  },
);

const HomePage = mongoose.model("HomePage", homePageSchema);
export default HomePage;
