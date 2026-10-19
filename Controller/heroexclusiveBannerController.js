import HomePage from "../Models/HomePage.js";

const uploadedImageUrl = (req, fieldName) => {
  const file = req.files?.[fieldName]?.[0];
  if (!file) return undefined;
  const relativePath = file.path.replace(/\\/g, "/");
  const uploadsIndex = relativePath.lastIndexOf("uploads/");
  const uploadPath = uploadsIndex >= 0
    ? relativePath.slice(uploadsIndex + "uploads/".length)
    : relativePath;
  return `${req.protocol}://${req.get("host")}/uploads/${uploadPath}`;
};

const parseActive = (active) => {
  if (active === undefined) return undefined;
  if (active === true || active === "true") return true;
  if (active === false || active === "false") return false;
  return null;
};

// Helper: get or create homepage document
const getHomePage = async () => {
  let homePage = await HomePage.findOne();

  if (!homePage) {
    homePage = await HomePage.create({
      heroexclusiveBanner: [],
    });
  }

  return homePage;
};

// CREATE banner
export const addHeroexclusiveBanner = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const desktopImage = uploadedImageUrl(req, "desktopImage") ?? req.body.desktopImage;
    const mobileImage = uploadedImageUrl(req, "mobileImage") ?? req.body.mobileImage;
    const active = parseActive(req.body.active);

    if (!desktopImage || !mobileImage || !title) {
      return res.status(400).json({
        success: false,
        message: "desktopImage, mobileImage and title are required",
      });
    }

    if (active === null) {
      return res.status(400).json({
        success: false,
        message: "active must be true or false",
      });
    }

    const homePage = await getHomePage();
    const banner = {
      desktopImage,
      mobileImage,
      title,
      description: description || "",
      tags: tags || "",
      active: active ?? true,
    };
    homePage.heroexclusiveBanner.push(banner);
    await homePage.save();

    return res.status(201).json({
      success: true,
      message: "Hero exclusive banner added successfully",
      data: homePage.heroexclusiveBanner[
        homePage.heroexclusiveBanner.length - 1
      ],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET all banners
export const getAllHeroexclusiveBanners = async (req, res) => {
  try {
    const homePage = await HomePage.findOne();

    const banners = homePage?.heroexclusiveBanner || [];

    return res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET banner by index
export const getHeroexclusiveBannerByIndex = async (req, res) => {
  try {
    const index = Number(req.params.index);
    const homePage = await HomePage.findOne();

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      !homePage?.heroexclusiveBanner[index]
    ) {
      return res.status(404).json({
        success: false,
        message: "Hero exclusive banner not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: homePage.heroexclusiveBanner[index],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE banner by index
export const updateHeroexclusiveBanner = async (req, res) => {
  try {
    const index = Number(req.params.index);
    const homePage = await HomePage.findOne();

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      !homePage?.heroexclusiveBanner[index]
    ) {
      return res.status(404).json({
        success: false,
        message: "Hero exclusive banner not found",
      });
    }

    const item = homePage.heroexclusiveBanner[index];
    const { title, description, tags } = req.body;
    const desktopImage = uploadedImageUrl(req, "desktopImage") ?? req.body.desktopImage;
    const mobileImage = uploadedImageUrl(req, "mobileImage") ?? req.body.mobileImage;
    const active = parseActive(req.body.active);

    if (active === null) {
      return res.status(400).json({
        success: false,
        message: "active must be true or false",
      });
    }

    if (desktopImage !== undefined) item.desktopImage = desktopImage;
    if (mobileImage !== undefined) item.mobileImage = mobileImage;
    if (title !== undefined) item.title = title;
    if (description !== undefined) item.description = description;

    if (tags !== undefined) {
      if (typeof tags !== "string") {
        return res.status(400).json({
          success: false,
          message: "tags must be a string",
        });
      }

      item.tags = tags;
    }

    if (active !== undefined) item.active = active;

    await homePage.save();

    return res.status(200).json({
      success: true,
      message: "Hero exclusive banner updated successfully",
      data: item,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE banner by index
export const deleteHeroexclusiveBanner = async (req, res) => {
  try {
    const index = Number(req.params.index);
    const homePage = await HomePage.findOne();

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      !homePage?.heroexclusiveBanner[index]
    ) {
      return res.status(404).json({
        success: false,
        message: "Hero exclusive banner not found",
      });
    }

    homePage.heroexclusiveBanner.splice(index, 1);
    await homePage.save();

    return res.status(200).json({
      success: true,
      message: "Hero exclusive banner deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
