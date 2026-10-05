// models/ContactDetails.js

import mongoose from "mongoose";

const contactDetailsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const ContactDetails = mongoose.model(
  "ContactDetails",
  contactDetailsSchema
);

export default ContactDetails;