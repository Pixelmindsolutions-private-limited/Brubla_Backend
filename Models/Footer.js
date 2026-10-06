import mongoose from "mongoose";

const socialMediaSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "instagram",
        "facebook",
        "pinterest",
        "youtube",
        "twitter",
        "linkedin",
        "tiktok",
      ],
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const footerSchema = new mongoose.Schema(
  {
    description: {
      type: [String],
      required: true,
      default: [],
      trim: true,
    },

    socialMedia: {
      type: [socialMediaSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Footer = mongoose.model("Footer", footerSchema);

export default Footer;