import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure Cloudinary storage with transformation
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ngo-uploads",
    format: async (req, file) => "webp", // Convert all images to WebP
    transformation: [
      { width: 1920, height: 1920, crop: "limit" }, // Max dimensions
      { quality: "auto:good" }, // Automatic quality optimization
      { fetch_format: "auto" } // Automatic format selection
    ],
    public_id: (req, file) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      return `${file.fieldname}-${uniqueSuffix}`;
    }
  }
});

// Upload middleware with file size and type validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for upload
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG, JPEG, PNG, and WEBP images are allowed"), false);
    }
    cb(null, true);
  }
});

// Export cloudinary for use in controllers (for deleting old images)
export { cloudinary };

export default upload;