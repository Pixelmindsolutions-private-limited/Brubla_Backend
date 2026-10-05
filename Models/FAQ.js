import mongoose from "mongoose";

// FAQ Question Schema
const faqQuestionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: true,
  }
);

// Main FAQ Schema
const faqSchema = new mongoose.Schema(
  {
    tag: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    questions: {
      type: [faqQuestionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const FAQ = mongoose.model("FAQ", faqSchema);

export default FAQ;