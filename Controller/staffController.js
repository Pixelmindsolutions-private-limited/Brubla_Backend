import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Staff from "../Models/Staff.js";

export const createStaff = async (req, res) => {
  try {
    const { name, email, mobile, password, permissions = [] } = req.body;

    // ==================== VALIDATION ====================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required",
      });
    }

    // Permissions must be an array
    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be an array",
      });
    }

    // ==================== CHECK EXISTING STAFF ====================

    const existingStaff = await Staff.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingStaff) {
      return res.status(409).json({
        success: false,
        message: "Staff with this email already exists",
      });
    }

    // ==================== CHECK MOBILE ====================

    if (mobile) {
      const existingMobile = await Staff.findOne({ mobile });

      if (existingMobile) {
        return res.status(409).json({
          success: false,
          message: "Staff with this mobile number already exists",
        });
      }
    }

    // ==================== PASSWORD ====================

    const hashedPassword = await bcrypt.hash(password, 10);

    // ==================== CREATE STAFF ====================

    const staff = await Staff.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile?.trim() || undefined,
      password: hashedPassword,
      role: "staff",
      permissions,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Staff created successfully",
      data: {
        staff: {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          mobile: staff.mobile,
          role: staff.role,
          permissions: staff.permissions,
          isActive: staff.isActive,
          createdAt: staff.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Create staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create staff",
      error: error.message,
    });
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const staff = await Staff.find()
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: staff.length,
      data: staff,
    });
  } catch (error) {
    console.error("Get all staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};
export const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findById(id).select(
      "-password -resetPasswordToken -resetPasswordExpires",
    );

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        staff,
      },
    });
  } catch (error) {
    console.error("Get staff by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch staff",
      error: error.message,
    });
  }
};
export const updateStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, email, mobile, password, permissions, isActive } = req.body;

    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    // ==================== BASIC INFO ====================

    if (name !== undefined) {
      staff.name = name.trim();
    }

    if (email !== undefined) {
      const normalizedEmail = email.toLowerCase().trim();

      const emailExists = await Staff.findOne({
        email: normalizedEmail,
        _id: { $ne: id },
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use",
        });
      }

      staff.email = normalizedEmail;
    }

    if (mobile !== undefined) {
      const mobileExists = await Staff.findOne({
        mobile,
        _id: { $ne: id },
      });

      if (mobileExists) {
        return res.status(409).json({
          success: false,
          message: "Mobile number already in use",
        });
      }

      staff.mobile = mobile.trim();
    }

    // ==================== PASSWORD ====================

    if (password) {
      staff.password = await bcrypt.hash(password, 10);
    }

    // ==================== PERMISSIONS ====================

    if (permissions !== undefined) {
      if (!Array.isArray(permissions)) {
        return res.status(400).json({
          success: false,
          message: "Permissions must be an array",
        });
      }

      staff.permissions = permissions;
    }

    // ==================== ACTIVE STATUS ====================

    if (isActive !== undefined) {
      staff.isActive = Boolean(isActive);
    }

    await staff.save();

    return res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: {
        staff: {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          mobile: staff.mobile,
          role: staff.role,
          permissions: staff.permissions,
          isActive: staff.isActive,
          updatedAt: staff.updatedAt,
        },
      },
    });
  } catch (error) {
    console.error("Update staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update staff",
      error: error.message,
    });
  }
};
export const deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findByIdAndDelete(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
      data: {
        id: staff._id,
      },
    });
  } catch (error) {
    console.error("Delete staff error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete staff",
      error: error.message,
    });
  }
};
export const toggleStaffStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const staff = await Staff.findById(id);

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: "Staff not found",
      });
    }

    staff.isActive = !staff.isActive;

    await staff.save();

    return res.status(200).json({
      success: true,
      message: staff.isActive
        ? "Staff activated successfully"
        : "Staff deactivated successfully",
      data: {
        id: staff._id,
        isActive: staff.isActive,
      },
    });
  } catch (error) {
    console.error("Toggle staff status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update staff status",
      error: error.message,
    });
  }
};
// ==================== STAFF LOGIN ====================
export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const staff = await Staff.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (!staff.password) {
      return res.status(500).json({
        success: false,
        message: "Staff password is not stored in database",
      });
    }

    if (!staff.isActive) {
      return res.status(403).json({
        success: false,
        message: "Staff account is inactive",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, staff.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: staff._id,
        role: "staff",
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "7d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "Staff login successful",
      data: {
        staff: {
          id: staff._id,
          name: staff.name,
          email: staff.email,
          mobile: staff.mobile,
          role: "staff",
          permissions: staff.permissions,
          isActive: staff.isActive,
        },
        token,
      },
    });
  } catch (error) {
    console.error("Staff login error:", error);

    return res.status(500).json({
      success: false,
      message: "Staff login failed",
      error: error.message,
    });
  }
};
