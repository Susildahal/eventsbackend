import mongoose from "mongoose";
import Gallery from "../models/gallery.js";
import { v2 as cloudinary } from "cloudinary";

// Create gallery item with image upload to Cloudinary
export const createGalleryItem = async (req, res) => {
  try {
    const { title, image } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    let imageUrl, publicId;
    if (req.file) {
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
      imageUrl = result.secure_url;
      publicId = result.public_id;
    } else if (image) {
      // Use provided image URL
      imageUrl = image;
      publicId = null;
    } else {
      return res.status(400).json({ message: "Image file or image URL is required" });
    }

    // Save to database
    const item = new Gallery({
      title,
      image: imageUrl,
      public_id: publicId
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

    const title = req.query.title || "";
    const status = req.query.status;

    let filter = {};

    // Title filter
    if (title) {
      filter.title = new RegExp(title, "i");
    }

    // Status filter (only if passed)
    if (status === "true") {
      filter.status = true;
    } else if (status === "false") {
      filter.status = false;
    }

    const total = await Gallery.countDocuments(filter);
    const items = await Gallery.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      data: items,
      pagination: { total, page, limit },
    });
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
    const { title, image } = req.body;
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    let updateData = { title };

    if (req.file) {
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

      updateData.image = result.secure_url;
      updateData.public_id = result.public_id;
    } else if (image) {
      // Use provided image URL
      updateData.image = image;
      // Optionally delete old if changing to URL, but keep public_id for now
    } else {
      return res.status(400).json({ message: "Image file or image URL is required" });
    }

    // Update database
    const updated = await Gallery.findByIdAndUpdate(id, updateData, { new: true });

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

 export const toggleGalleryItemStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }
    const item = await Gallery.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }
    item.status = !item.status;
    await item.save();
    res.status(200).json({ message: "Gallery item status updated", data: item });
  }
  catch (error) {
    res.status(500).json({ message: error.message });
  }
};
