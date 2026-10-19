
import express from "express";

import {
  getWebsiteHeroexclusiveBanners,
} from "../Controller/websiteHeroexclusiveBannerController.js";

const router = express.Router();

router.get("/heroexclusive-banner/", getWebsiteHeroexclusiveBanners);

export default router;
