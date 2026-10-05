import HomePage from "../Models/HomePage.js";
import { getFileUrl } from "../utils/fileUtils.js";
const cleanImageUrl = (value) => {
  if (!value) return value;

  // Convert Markdown image/link format to plain URL
  const markdownMatch = value.match(/^\[([^\]]+)\]\(([^)]+)\)$/);

  if (markdownMatch) {
    return markdownMatch[2];
  }

  return value.trim();
};
// ==========================================
// POST - ADD / CREATE EXCLUSIVE
// POST /api/homepage/exclusive
// ==========================================
export const addExclusive = async (req, res) => {
  try {
    const {
      tag,
      title,
      description,
      img,
      redirectionLink,
      isActive,
    } = req.body;

    const imageUrl = req.file
      ? getFileUrl(req, req.file.filename, "profiles")
      : img;

    if (!tag || !title || !description || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Tag, title, description and image are required",
      });
    }

    const cleanImg = cleanImageUrl(imageUrl);

    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = new HomePage({
        heroSections: [],
        banners: [],
        exclusive: null,
        homepageCollections: [],
      });
    }

    if (homePage.exclusive) {
      return res.status(400).json({
        success: false,
        message: "Exclusive section already exists. Please update it instead.",
      });
    }

    homePage.exclusive = {
      tag: tag.trim(),
      title: title.trim(),
      description: description.trim(),
      img: cleanImg,
      redirectionLink: redirectionLink || null,
      isActive: isActive !== undefined ? isActive : true,
    };

    await homePage.save();

    return res.status(201).json({
      success: true,
      message: "Exclusive section added successfully",
      data: homePage.exclusive,
    });
  } catch (error) {
    console.error("Add Exclusive Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add exclusive section",
      error: error.message,
    });
  }
};

// ==========================================
// GET - EXCLUSIVE
// GET /api/homepage/exclusive
// ==========================================
export const getExclusive = async (req, res) => {
  try {
    const homePage = await HomePage.findOne().select("exclusive");

    if (!homePage || !homePage.exclusive) {
      return res.status(404).json({
        success: false,
        message: "Exclusive section not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Exclusive section fetched successfully",
      data: homePage.exclusive,
    });
  } catch (error) {
    console.error("Get Exclusive Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch exclusive section",
      error: error.message,
    });
  }
};

// ==========================================
// PUT - EDIT EXCLUSIVE
// PUT /api/homepage/exclusive
// ==========================================
export const updateExclusive = async (req, res) => {
  try {
    const {
      tag,
      title,
      description,
      img,
      redirectionLink,
      isActive,
    } = req.body;

    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: "Home page not found",
      });
    }

    if (!homePage.exclusive) {
      return res.status(404).json({
        success: false,
        message: "Exclusive section not found",
      });
    }

    if (tag !== undefined) {
      homePage.exclusive.tag = tag.trim();
    }

    if (title !== undefined) {
      homePage.exclusive.title = title.trim();
    }

    if (description !== undefined) {
      homePage.exclusive.description = description.trim();
    }

    if (req.file || img !== undefined) {
      const imageUrl = req.file
        ? getFileUrl(req, req.file.filename, "profiles")
        : img;
      homePage.exclusive.img = cleanImageUrl(imageUrl);
    }

    if (redirectionLink !== undefined) {
      homePage.exclusive.redirectionLink = redirectionLink;
    }

    if (isActive !== undefined) {
      homePage.exclusive.isActive = isActive;
    }

    await homePage.save();

    return res.status(200).json({
      success: true,
      message: "Exclusive section updated successfully",
      data: homePage.exclusive,
    });
  } catch (error) {
    console.error("Update Exclusive Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update exclusive section",
      error: error.message,
    });
  }
};
// ==========================================
// DELETE - DELETE EXCLUSIVE
// DELETE /api/homepage/exclusive
// ==========================================
export const deleteExclusive = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();

    if (!homePage) {
      return res.status(404).json({
        success: false,
        message: "Home page not found",
      });
    }

    if (!homePage.exclusive) {
      return res.status(404).json({
        success: false,
        message: "Exclusive section not found",
      });
    }

    homePage.exclusive = null;

    await homePage.save();

    return res.status(200).json({
      success: true,
      message: "Exclusive section deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Delete Exclusive Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete exclusive section",
      error: error.message,
    });
  }
};