import express from "express";

import { getExclusive } from "../Controller/exclusiveController.js";

const router = express.Router();

router.get("/", getExclusive);

export default router;
