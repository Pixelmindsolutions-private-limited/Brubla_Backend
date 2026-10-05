import PhilosophySection from "../Models/HomePage.js";


// ==========================================
// GET - GET PHILOSOPHY
// GET /api/homepage/philosophy
// ==========================================
export const getPhilosophy = async (req, res) => {
  try {
    const homePage = await PhilosophySection.findOne();

    if (!homePage || !homePage.philosophy) {
      return res.status(404).json({
        success: false,
        message: "Philosophy section not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Philosophy section fetched successfully",
      data: homePage.philosophy,
    });
  } catch (error) {
    console.error("Get Philosophy Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch philosophy section",
      error: error.message,
    });
  }
};

