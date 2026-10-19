import mongoose from "mongoose";

const announcementBarSchema = new mongoose.Schema(
  {
    text: {
      type: [String],
      default: [],
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const AnnouncementBar = mongoose.model(
  "AnnouncementBar",
  announcementBarSchema
);

export default AnnouncementBar;