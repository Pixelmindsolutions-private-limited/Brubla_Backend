import FAQ from "../Models/FAQ.js";

// =====================================================
// GET - GET ALL FAQS
// GET /api/admin/faq
// =====================================================
export const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      message: "FAQs fetched successfully",
      count: faqs.length,
      data: faqs,
    });
  } catch (error) {
    console.error("Get FAQs Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch FAQs",
      error: error.message,
    });
  }
};
