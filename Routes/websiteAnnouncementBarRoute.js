import express from "express";

import { getWebsiteAnnouncementBars } from "../Controller/websiteAnnouncementBarController.js";

const router = express.Router();

router.get("/announcement-bar", getWebsiteAnnouncementBars);

export default router;
