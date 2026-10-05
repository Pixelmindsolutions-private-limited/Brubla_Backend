import express from "express";

import { getAllFAQs } from "../Controller/faqController.js";

const router = express.Router();

router.get("/", getAllFAQs);

export default router;
