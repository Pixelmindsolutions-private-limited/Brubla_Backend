// // config/multerConfig.js
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Ensure upload directory exists
// const ensureDirectoryExists = (dir) => {
//   if (!fs.existsSync(dir)) {
//     fs.mkdirSync(dir, { recursive: true });
//   }
// };

// // ==================== STORAGE CONFIGURATIONS ====================

// // Configure storage for profile images
// const profileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/profiles';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'profile-' + uniqueSuffix + ext);
//   }
// });

// // Configure storage for product images
// const productImageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/products';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'product-' + uniqueSuffix + ext);
//   }
// });

// const collectionImageStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/collections';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'collection-' + uniqueSuffix + ext);
//   }
// });

// // Configure storage for product images (separate folder - legacy)
// const productImageOnlyStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/products/images';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'product-img-' + uniqueSuffix + ext);
//   }
// });

// // Configure storage for product videos
// const productVideoStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/products/videos';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'product-video-' + uniqueSuffix + ext);
//   }
// });

// // Configure storage for banners
// const bannerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/banners';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'banner-' + uniqueSuffix + ext);
//   }
// });

// // Configure storage for subcategories
// const subcategoryStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/subcategories';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'subcategory-' + uniqueSuffix + ext);
//   }
// });

// // ==================== FILE FILTERS ====================

// // File filter for images
// const imageFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
  
//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
//   }
// };

// // File filter for videos
// const videoFilter = (req, file, cb) => {
//   const allowedTypes = /mp4|mov|webm|avi/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
  
//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only video files are allowed (mp4, mov, webm, avi)'));
//   }
// };

// // ==================== MULTER MIDDLEWARES ====================

// // // ✅ CORRECT: Use fields() for product creation (images + videos together)
// // export const uploadProductMedia = multer({
// //   storage: productImageStorage,
// //   limits: { 
// //     fileSize: 50 * 1024 * 1024, // 50MB limit
// //     files: 25 // Max 25 files total
// //   },
// //   fileFilter: (req, file, cb) => {
// //     if (file.fieldname === 'images') {
// //       imageFilter(req, file, cb);
// //     } else if (file.fieldname === 'videos') {
// //       videoFilter(req, file, cb);
// //     } else {
// //       cb(new Error('Invalid field name. Use "images" or "videos"'));
// //     }
// //   }
// // }).fields([
// //   { name: 'images', maxCount: 20 },  // Max 20 images
// //   { name: 'videos', maxCount: 5 }     // Max 5 videos
// // ]);

// // config/multerConfig.js

// // ✅ SIMPLE AND RELIABLE - Accepts any field name
// export const uploadProductMedia = multer({
//   storage: productImageStorage,
//   limits: { 
//     fileSize: 50 * 1024 * 1024, // 50MB limit per file
//     files: 50 // Max 50 files total
//   },
//   fileFilter: (req, file, cb) => {
//     // Allow image files
//     if (file.mimetype.startsWith('image/')) {
//       cb(null, true);
//     } 
//     // Allow video files
//     else if (file.mimetype.startsWith('video/')) {
//       cb(null, true);
//     }
//     else {
//       cb(new Error('Only images and videos are allowed'), false);
//     }
//   }
// }).any(); // ← KEY: .any() accepts any field names

// // Alternative: If you want to keep the old one for backward compatibility
// export const uploadProductMediaLegacy = multer({
//   storage: productImageStorage,
//   limits: { 
//     fileSize: 50 * 1024 * 1024,
//     files: 25
//   },
//   fileFilter: (req, file, cb) => {
//     if (file.fieldname === 'images') {
//       imageFilter(req, file, cb);
//     } else if (file.fieldname === 'videos') {
//       videoFilter(req, file, cb);
//     } else {
//       cb(new Error('Invalid field name. Use "images" or "videos"'));
//     }
//   }
// }).fields([
//   { name: 'images', maxCount: 20 },
//   { name: 'videos', maxCount: 5 }
// ]);

// // Upload for product images (multiple) - array format
// export const uploadProductImages = multer({
//   storage: productImageOnlyStorage,
//   limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per image
//   fileFilter: imageFilter
// }).array('images', 20); // Max 20 images

// // Upload for product videos (multiple) - array format
// export const uploadProductVideos = multer({
//   storage: productVideoStorage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit per video
//   fileFilter: videoFilter
// }).array('videos', 5); // Max 5 videos

// // Combined upload that handles both (sequential)
// export const uploadProductCombined = (req, res, next) => {
//   // First handle images
//   const imageUpload = multer({
//     storage: productImageOnlyStorage,
//     limits: { fileSize: 10 * 1024 * 1024 },
//     fileFilter: imageFilter
//   }).array('images', 20);
  
//   // Then handle videos
//   const videoUpload = multer({
//     storage: productVideoStorage,
//     limits: { fileSize: 50 * 1024 * 1024 },
//     fileFilter: videoFilter
//   }).array('videos', 5);
  
//   // Run image upload first
//   imageUpload(req, res, (err) => {
//     if (err) return next(err);
    
//     // Then run video upload
//     videoUpload(req, res, (err) => {
//       if (err) return next(err);
//       next();
//     });
//   });
// };

// // Create upload middleware for profile images
// export const uploadProfileImage = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: imageFilter
// }).single('profileImage');

// // Upload for multiple banners
// export const uploadBanners = multer({
//   storage: bannerStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter
// }).array('banners', 10);

// // Upload for single banner
// export const uploadBanner = multer({
//   storage: bannerStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter
// }).single('banner');

// // Upload for subcategory image
// export const uploadSubcategoryImage = multer({
//   storage: subcategoryStorage,
//   limits: { fileSize: 2 * 1024 * 1024 },
//   fileFilter: imageFilter
// }).single('image');

// // For single image upload (generic)
// export const uploadSingleImage = multer({
//   storage: productImageStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter
// }).single('image');

// // For multiple images without videos
// export const uploadMultipleImages = multer({
//   storage: productImageStorage,
//   limits: { fileSize: 10 * 1024 * 1024 },
//   fileFilter: imageFilter
// }).array('images', 20);

// // Generic upload for other files (fallback)
// export const upload = multer({
//   storage: profileStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter
// });

// export const uploadCollectionImage = multer({
//   storage: collectionImageStorage,
//   limits: { fileSize: 5 * 1024 * 1024 },
//   fileFilter: imageFilter
// }).single('image');

// // config/multerConfig.js - Add this
// const loginScreenStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = file.mimetype.startsWith('image/') 
//       ? 'uploads/login-screen/images' 
//       : 'uploads/login-screen/videos';
//     if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const prefix = file.mimetype.startsWith('image/') ? 'login-img' : 'login-vid';
//     cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
//   }
// });

// export const uploadLoginMedia = multer({
//   storage: loginScreenStorage,
//   limits: { fileSize: 100 * 1024 * 1024 },
//   fileFilter: (req, file, cb) => {
//     if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only images and videos allowed'), false);
//     }
//   }
// }).single('media');


// // ==================== HERO SECTION STORAGE ====================

// // Configure storage for hero section images/videos
// const heroStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const type = req.body.type;
//     let folder = 'uploads/homepage/hero/images';
    
//     if (type === 'video') {
//       folder = 'uploads/homepage/hero/videos';
//     } else if (file.mimetype.startsWith('video/')) {
//       folder = 'uploads/homepage/hero/videos';
//     }
    
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     const prefix = file.mimetype.startsWith('image/') ? 'hero-img' : 'hero-vid';
//     cb(null, `${prefix}-${uniqueSuffix}${ext}`);
//   }
// });

// // File filter for hero section
// const heroFilter = (req, file, cb) => {
//   const type = req.body.type;
  
//   if (type === 'image' && !file.mimetype.startsWith('image/')) {
//     cb(new Error('Please upload an image file for hero section'), false);
//   } else if (type === 'video' && !file.mimetype.startsWith('video/')) {
//     cb(new Error('Please upload a video file for hero section'), false);
//   } else if (!type && !file.mimetype.startsWith('image/') && !file.mimetype.startsWith('video/')) {
//     cb(new Error('Only images and videos are allowed for hero section'), false);
//   } else {
//     cb(null, true);
//   }
// };

// // ==================== HERO SECTION UPLOAD ====================

// // Hero section media upload (single file - image or video)
// export const uploadHeroMedia = multer({
//   storage: heroStorage,
//   limits: { fileSize: 100 * 1024 * 1024 },
//   fileFilter: heroFilter
// }).single('media');


// // ==================== BANNER STORAGE FOR HOMEPAGE ====================

// // Configure storage for homepage banners
// const homepageBannerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const folder = 'uploads/homepage/banners';
//     ensureDirectoryExists(folder);
//     cb(null, folder);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'banner-' + uniqueSuffix + ext);
//   }
// });

// // File filter for homepage banners
// const bannerFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png|gif|webp/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
  
//   if (mimetype && extname) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed for banners (jpeg, jpg, png, gif, webp)'));
//   }
// };

// // Upload for homepage banner (single image)
// export const uploadHomepageBanner = multer({
//   storage: homepageBannerStorage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
//   fileFilter: bannerFilter
// }).single('image'); 

// config/multerConfig.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// ═══════════════════════════════════════════════════════════════
// STORAGE CONFIGURATIONS
// ═══════════════════════════════════════════════════════════════

// ---- Product media (images AND videos) ----
const productMediaStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('video/')
      ? 'uploads/products/videos'
      : 'uploads/products/images';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const prefix = file.mimetype.startsWith('video/') ? 'product-video' : 'product-img';
    cb(null, `${prefix}-${uniqueSuffix}${ext}`);
  }
});

// ---- Legacy product image storage ----
const productImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/products';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ---- Profile ----
const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/profiles';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ---- Banner ----
const bannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/banners';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ---- Subcategory ----
const subcategoryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/subcategories';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'subcategory-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ---- Collection ----
const collectionImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/collections';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'collection-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ---- Login screen ----
const loginScreenStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = file.mimetype.startsWith('image/')
      ? 'uploads/login-screen/images'
      : 'uploads/login-screen/videos';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const prefix = file.mimetype.startsWith('image/') ? 'login-img' : 'login-vid';
    cb(null, `${prefix}-${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`);
  }
});

// ---- Hero ----
const heroStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.body.type;
    let folder = 'uploads/homepage/hero/images';
    if (type === 'video' || file.mimetype.startsWith('video/')) {
      folder = 'uploads/homepage/hero/videos';
    }
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const prefix = file.mimetype.startsWith('image/') ? 'hero-img' : 'hero-vid';
    cb(null, `${prefix}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// ---- Homepage banner ----
const homepageBannerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = 'uploads/homepage/banners';
    ensureDirectoryExists(folder);
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'banner-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// ═══════════════════════════════════════════════════════════════
// FILE FILTERS
// ═══════════════════════════════════════════════════════════════

const imageFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Only image files allowed'));
};

const videoFilter = (req, file, cb) => {
  const allowed = /mp4|mov|webm|avi|mkv/;
  const ok = allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype);
  ok ? cb(null, true) : cb(new Error('Only video files allowed'));
};

const mediaFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only images and videos allowed'));
  }
};

// ═══════════════════════════════════════════════════════════════
// PRODUCT MEDIA UPLOAD (strict field names)
// ═══════════════════════════════════════════════════════════════

export const uploadProductMedia = multer({
  storage: productMediaStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB per file
    files: 50
  },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'product_video') {
      const videoTypes = {
        '.mp4': 'video/mp4',
        '.mov': 'video/quicktime',
        '.webm': 'video/webm',
        '.avi': 'video/x-msvideo',
        '.mkv': 'video/x-matroska',
      };
      const extension = path.extname(file.originalname).toLowerCase();
      if (!file.mimetype.startsWith('video/') && videoTypes[extension]) {
        file.mimetype = videoTypes[extension];
      }
      if (file.mimetype.startsWith('video/')) return cb(null, true);
      return cb(new Error('product_video must be a video file'), false);
    }

    // IMAGES → must be variant_<N>_images
    if (file.mimetype.startsWith('image/')) {
      if (!/^variant_\d+_images$/.test(file.fieldname)) {
        return cb(new Error(
          `Invalid image fieldname "${file.fieldname}". Use "variant_<index>_images" (e.g., variant_0_images).`
        ), false);
      }
      return cb(null, true);
    }

    // VIDEOS → must be product_video
    if (file.mimetype.startsWith('video/')) {
      if (file.fieldname !== 'product_video') {
        return cb(new Error(
          `Invalid video fieldname "${file.fieldname}". Use "product_video".`
        ), false);
      }
      return cb(null, true);
    }

    cb(new Error('Only image and video files are allowed'), false);
  }
}).any();

// ═══════════════════════════════════════════════════════════════
// OTHER UPLOADS
// ═══════════════════════════════════════════════════════════════

export const uploadProfileImage = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
}).single('profileImage');

export const uploadBanners = multer({
  storage: bannerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
}).array('banners', 10);

export const uploadBanner = multer({
  storage: bannerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
}).single('banner');

export const uploadSubcategoryImage = multer({
  storage: subcategoryStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: imageFilter
}).single('image');

export const uploadCollectionImage = multer({
  storage: collectionImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
}).single('image');

export const uploadLoginMedia = multer({
  storage: loginScreenStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: mediaFilter
}).single('media');

export const uploadHeroMedia = multer({
  storage: heroStorage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: mediaFilter
}).single('media');

export const uploadHomepageBanner = multer({
  storage: homepageBannerStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
}).single('image');

// ═══════════════════════════════════════════════════════════════
// ✅ ADDED BACK — generic exports needed by adminRoutes.js
// ═══════════════════════════════════════════════════════════════

// For multiple image uploads (array format)
// Field name: 'images', max 20 images
export const uploadMultipleImages = multer({
  storage: productImageStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB per image
  fileFilter: imageFilter
}).array('images', 20);

// For single image upload (generic)
// Field name: 'image'
export const uploadSingleImage = multer({
  storage: productImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: imageFilter
}).single('image');

// Generic raw multer instance (used by userRoutes.js)
// Chain .single(), .array(), .fields(), .any() on this yourself
export const upload = multer({
  storage: profileStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: imageFilter
});



const categoryStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/categories/"),
  filename: (req, file, cb) =>
    cb(null, `cat-${Date.now()}${path.extname(file.originalname)}`),
});

const categoryUpload = multer({ storage: categoryStorage });

// Field name MUST be "image" to match formData.append("image", ...)
export const uploadCategoryImage = categoryUpload.single("image");
