
import HomePage from "../Models/HomePage.js";

export const getWebsiteHeroexclusiveBanners = async (req, res) => {
  try {
    const homePage = await HomePage.findOne()
      .select("heroexclusiveBanner");

    const banners = (homePage?.heroexclusiveBanner || []).filter(
      (banner) => banner.active === true
    );

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
