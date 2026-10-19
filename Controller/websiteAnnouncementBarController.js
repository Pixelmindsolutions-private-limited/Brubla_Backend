
import AnnouncementBar from "../Models/AnnouncementBar.js";

// GET active announcement bars for website
export const getWebsiteAnnouncementBars = async (req, res) => {
  try {
    const announcements = await AnnouncementBar.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    console.error("Website announcement bar error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
