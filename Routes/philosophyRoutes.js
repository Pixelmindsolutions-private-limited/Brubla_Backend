import express from "express";

import { getPhilosophy } from "../Controller/philosophyController.js";

const router = express.Router();

router.get("/", getPhilosophy);

export default router;
