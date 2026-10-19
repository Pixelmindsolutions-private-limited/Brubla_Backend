import mongoose from "mongoose";
import AnnouncementBar from "../Models/AnnouncementBar.js";

// CREATE announcement bar
export const createAnnouncementBar = async (req, res) => {
  try {
    const { text, isActive } = req.body;

    if (!Array.isArray(text) || text.length === 0) {
      return res.status(400).json({
        success: false,
        message: "text must be a non-empty array of strings",
      });
    }

    if (!text.every((item) => typeof item === "string" && item.trim())) {
      return res.status(400).json({
        success: false,
        message: "Every text item must be a non-empty string",
      });
    }

    if (isActive !== undefined && typeof isActive !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isActive must be true or false",
      });
    }

    const announcement = await AnnouncementBar.create({
      text: text.map((item) => item.trim()),
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      success: true,
      message: "Announcement bar created successfully",
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL announcement bars (Admin)
export const getAllAnnouncementBars = async (req, res) => {
  try {
    const announcements = await AnnouncementBar.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: announcements.length,
      data: announcements,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET announcement bar by ID (Admin)
export const getAnnouncementBarById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
      });
    }

    const announcement = await AnnouncementBar.findById(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement bar not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// EDIT announcement bar by ID
export const updateAnnouncementBar = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, isActive } = req.body;

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement ID",
      });
    }

    const updateData = {};

    if (text !== undefined) {
      if (
        !Array.isArray(text) ||
        text.length === 0 ||
        !text.every((item) => typeof item === "string" && item.trim())
      ) {
        return res.status(400).json({
          success: false,
          message: "text must be a non-empty array of non-empty strings",
        });
      }

      updateData.text = text.map((item) => item.trim());
    }

    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return res.status(400).json({
          success: false,
          message: "isActive must be true or false",
        });
      }

      updateData.isActive = isActive;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide text or isActive to update",
      });
    }

    const announcement = await AnnouncementBar.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement bar not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement bar updated successfully",
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// DELETE announcement bar by ID
export const deleteAnnouncementBar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid announcement bar ID",
      });
    }

    const announcement = await AnnouncementBar.findByIdAndDelete(id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement bar not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Announcement bar deleted successfully",
      data: announcement,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
