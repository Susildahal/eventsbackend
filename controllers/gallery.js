import mongoose from "mongoose";
import Gallery from "../models/gallery.js";
import { v2 as cloudinary } from "cloudinary";

// Create gallery item with image upload to Cloudinary
export const createGalleryItem = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    // Upload buffer to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "events", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Save to database
    const item = new Gallery({
      title,
      image: result.secure_url,
      public_id: result.public_id
    });
    await item.save();

    res.status(201).json({ message: "Gallery item created", data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all gallery items with pagination
export const getAllGalleryItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Gallery.countDocuments();
    const items = await Gallery.find().skip(skip).limit(limit);

    res.status(200).json({ data: items, pagination: { total, page, limit } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single gallery item
export const getGalleryItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }
    const item = await Gallery.findById(id);
    if (!item) return res.status(404).json({ message: "Gallery item not found" });
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update gallery item
export const updateGalleryItem = async (req, res) => {
  try {
    const { title } = req.body;
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }
    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and image are required" });
    }

    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Delete old image from Cloudinary
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    // Upload new image
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "events", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    // Update database
    const updated = await Gallery.findByIdAndUpdate(
      id,
      { title, image: result.secure_url, public_id: result.public_id },
      { new: true }
    );

    res.status(200).json({ message: "Gallery item updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete gallery item
export const deleteGalleryItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }

    const item = await Gallery.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    // Delete from Cloudinary
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    res.status(200).json({ message: "Gallery item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
