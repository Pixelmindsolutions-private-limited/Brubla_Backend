import mongoose from "mongoose";

// ============================
// CONNECTIONS ITEM
// ============================
const connectionSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      default: ""
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);

// ============================
// OUR PURPOSE SCHEMA
// ============================
const purposeSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      default: "Our purpose",
      trim: true
    },

    paragraphs: {
      type: [String],
      default: []
    },

    highlightText: {
      type: String,
      default: "",
      trim: true
    },

    closingText: {
      type: String,
      default: "",
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    _id: false
  }
);


// ============================
// MARKETPLACE CONNECTION
// ============================
const marketplaceConnectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);


// ============================
// EXPERIENCE ITEM
// ============================
const experienceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    text: {
      type: String,
      required: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);


// ============================
// PEOPLE ITEM
// ============================
const peopleSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      trim: true
    },

    line: {
      type: String,
      required: true,
      trim: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { _id: true }
);


// ============================
// ABOUT PAGE MODEL
// ============================
const aboutPageSchema = new mongoose.Schema(
  {

    // ============================
    // HERO
    // ============================
    hero: {
      title: {
        type: String,
        default: "About BRUBLA"
      },

      subtitle: {
        type: String,
        default: ""
      },

      description: {
        type: String,
        default: ""
      },

      additionalText: {
        type: String,
        default: ""
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // MARQUEE
    // ============================
    marquee: {
      items: {
        type: [String],
        default: []
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // PURPOSE
    // ============================
    purpose: {
      type: purposeSchema,
      default: () => ({})
    },


    // ============================
    // CONNECTIONS
    // ============================
    connections: {
      heading: {
        type: String,
        default: "One platform. Three connections."
      },

      items: {
        type: [connectionSchema],
        default: []
      },

      bottomText: {
        type: String,
        default: ""
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // ACCESSIBILITY
    // ============================
    accessibility: {
      heading: {
        type: String,
        default: "Making designer fashion more accessible"
      },

      highlightText: {
        type: String,
        default: ""
      },

      paragraphs: {
        type: [String],
        default: []
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // MARKETPLACE
    // ============================
    marketplace: {
      heading: {
        type: String,
        default: "More than a fashion marketplace"
      },

      description: {
        type: String,
        default: ""
      },

      connections: {
        type: [marketplaceConnectionSchema],
        default: []
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // DESIGNERS
    // ============================
    designers: {
      heading: {
        type: String,
        default: "Empowering designers"
      },

      paragraphs: {
        type: [String],
        default: []
      },

      highlightText: {
        type: String,
        default: ""
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // TAILORS
    // ============================
    tailors: {
      heading: {
        type: String,
        default: "Connecting customers with local tailors"
      },

      paragraphs: {
        type: [String],
        default: []
      },

      journey: {
        type: [String],
        default: []
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // VISION
    // ============================
    vision: {
      heading: {
        type: String,
        default: "Our vision"
      },

      paragraphs: {
        type: [String],
        default: []
      },

      highlightText: {
        type: String,
        default: ""
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // EXPERIENCE
    // ============================
    experience: {
      heading: {
        type: String,
        default: "The BRUBLA experience"
      },

      items: {
        type: [experienceSchema],
        default: []
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // PEOPLE
    // ============================
    people: {
      heading: {
        type: String,
        default: "Built around people"
      },

      description: {
        type: String,
        default: ""
      },

      items: {
        type: [peopleSchema],
        default: []
      },

      bottomText: {
        type: String,
        default: ""
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // FUTURE
    // ============================
    future: {
      heading: {
        type: String,
        default: "The future of personal fashion"
      },

      paragraphs: {
        type: [String],
        default: []
      },

      title: {
        type: String,
        default: ""
      },

      subtitle: {
        type: String,
        default: ""
      },

      isActive: {
        type: Boolean,
        default: true
      }
    },


    // ============================
    // PUBLISH STATUS
    // ============================
    isPublished: {
      type: Boolean,
      default: true
    }

  },
  {
    timestamps: true
  }
);


const AboutPage = mongoose.model("AboutPage", aboutPageSchema);

export default AboutPage;
