import mongoose from "mongoose";
import Aboutimage from "../models/aboutimage.js";
import { v2 as cloudinary } from "cloudinary";

// Create Aboutimage item with image upload to Cloudinary
export const createaboutimage = async (req, res) => {
  try {
    const { title, image } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }
    const total = await Aboutimage.countDocuments();
    if (total >= 5) {
      return res.status(400).json({ message: "Maximum of 5 images allowed" });
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
      publicId = null; // No public_id for external URLs
    } else {
      return res.status(400).json({ message: "Image file or image URL is required" });
    }

    // Save to database
    const item = new Aboutimage({
      title,
      image: imageUrl,
      public_id: publicId
    });
    await item.save();

    res.status(201).json({ message: "Aboutimage item created", data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Aboutimage items with pagination
export const getAllAboutimageItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Aboutimage.countDocuments();
    const items = await Aboutimage.find().skip(skip).limit(limit);

    res.status(200).json({ data: items, pagination: { total, page, limit } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single Aboutimage item
export const getAboutimageItemById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }
    const item = await Aboutimage.findById(id);
    if (!item) return res.status(404).json({ message: "Aboutimage item not found" });
    res.status(200).json({ data: item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Aboutimage item
export const updateAboutimageItem = async (req, res) => {
  try {
    const { title, image } = req.body;
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }
    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const item = await Aboutimage.findById(id);
    if (!item) {
      return res.status(404).json({ message: "Aboutimage item not found" });
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
    }

    // Update database
    const updated = await Aboutimage.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({ message: "Aboutimage item updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Aboutimage item
export const deleteAboutimageItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined" || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid or missing id parameter" });
    }

    const item = await Aboutimage.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Aboutimage item not found" });
    }

    // Delete from Cloudinary
    if (item.public_id) {
      await cloudinary.uploader.destroy(item.public_id);
    }

    res.status(200).json({ message: "Aboutimage item deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
