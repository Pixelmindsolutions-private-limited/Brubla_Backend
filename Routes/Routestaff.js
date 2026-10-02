import express from "express";
import {
  createStaff,
  getAllStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  toggleStaffStatus,
  staffLogin,

} from "../Controller/staffController.js";

const router = express.Router();

// Staff Management
router.post("/login", staffLogin);
router.post("/", createStaff);
router.get("/", getAllStaff);
router.get("/:id", getStaffById);
router.put("/:id", updateStaff);
router.delete("/:id", deleteStaff);
router.patch("/:id/status", toggleStaffStatus);

export default router;
