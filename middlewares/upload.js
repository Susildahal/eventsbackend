import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";

const storage = multer.memoryStorage();

// Upload middleware with file size and type validation
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for upload
  fileFilter: (req, file, cb) => {
    // Accept any image/* MIME type (includes svg+xml) to be permissive for clients
    // If a non-image field arrives, we won't throw — we record it and skip the file so the request continues.
    try {
      const isImage = typeof file.mimetype === 'string' && file.mimetype.startsWith('image/');
      if (!isImage) {
        req.rejectedFiles = req.rejectedFiles || [];
        req.rejectedFiles.push({ fieldname: file.fieldname, originalname: file.originalname, mimetype: file.mimetype });
        return cb(null, false);
      }
      return cb(null, true);
    } catch (err) {
      // In case of unexpected errors, be conservative and skip the file instead of crashing
      req.rejectedFiles = req.rejectedFiles || [];
      req.rejectedFiles.push({ fieldname: file.fieldname, originalname: file.originalname, mimetype: file.mimetype, error: String(err) });
      return cb(null, false);
    }
  }
});

// Export cloudinary for use in controllers (for deleting old images)
export { cloudinary };

export default upload;
