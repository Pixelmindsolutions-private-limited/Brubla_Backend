import mongoose from "mongoose";

const staffSchema = new mongoose.Schema(
  {
    // ==================== BASIC INFO ====================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    // ==================== LOGIN ====================
    password: {
      type: String,
      required: true, 
      minlength: 6,
      select: false,
    },

    // ==================== ROLE ====================
    role: {
      type: String,
      enum: ["staff"],
      default: "staff",
    },

    // ==================== STATUS ====================
    isActive: {
      type: Boolean,
      default: true,
    },

    // ==================== ADMIN SELECTED ACCESS ====================
    permissions: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        path: {
          type: String,
          required: true,
          trim: true,
        },
      },
    ],

    // ==================== LAST LOGIN ====================
    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Staff", staffSchema);
