import mongoose from "mongoose";
import VenueSourcing from "../models/servicedashboard.js";
import { cloudinary } from "../config/cloudinary.js";

// Helper to extract the first file from req.files array or req.file
const getFileFromRequest = (req) => {
  if (req.file) return req.file;
  if (req.files && Array.isArray(req.files) && req.files.length > 0) return req.files[0];
  return null;
};

// CREATE new Venue Sourcing (used only first time)
export const createVenueSourcing = async (req, res) => {
  const serviceid = req.body.serviceid;
  try {
    const data = await VenueSourcing.create(req.body);

    // If image file was sent (in any field), upload it to Cloudinary
    const imageFile = getFileFromRequest(req);
    if (imageFile && imageFile.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "events", resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(imageFile.buffer);
      });

      // Update document with hero.image and hero.public_id
      data.hero = data.hero || {};
      data.hero.image = result.secure_url;
      data.hero.public_id = result.public_id;
      await data.save();
    }

    res.status(201).json({
      success: true,
      message: "Venue Sourcing created successfully",
      data,
      serviceid: serviceid
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// UPDATE Venue Sourcing (used every time after first)
export const updateVenueSourcing = async (req, res) => {
  try {
    const { id } = req.params;
    let updatePayload = req.body;

    // If image file was sent (in any field), upload it first
    const imageFile = getFileFromRequest(req);
    if (imageFile && imageFile.buffer) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "events", resource_type: "auto" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(imageFile.buffer);
      });

      // Delete previous image if present
      const existing = await VenueSourcing.findById(id).lean();
      if (existing && existing.hero && existing.hero.public_id) {
        try {
          await cloudinary.uploader.destroy(existing.hero.public_id, { resource_type: 'image' });
        } catch (e) {
          console.warn('Failed to delete previous image:', e.message);
        }
      }

      // Use $set to update only image fields, preserving other hero properties
      updatePayload = {
        ...req.body,
        $set: {
          'hero.image': result.secure_url,
          'hero.public_id': result.public_id
        }
      };
      // Remove the nested hero from req.body to avoid conflicts
      delete updatePayload.hero;
    }

    const updated = await VenueSourcing.findByIdAndUpdate(id, updatePayload, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.json({
      success: true,
      message: "Venue Sourcing updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getVenueSourcing = async (req, res) => {
  try {
    const { serviceid, servicename } = req.query;

    let filter = {};

    if (serviceid) {
      filter["serviceid.id"] = serviceid;
    }

if (servicename) {
  filter["serviceid.name"] = new RegExp(`^${servicename}$`, "i");
}


    console.log("Final Filter:", filter);

    const data = await VenueSourcing.find(filter);

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    res.status(200).json({ data });

  } catch (error) {
    console.error("Get Venue Sourcing Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};


// Upload only the hero image for an existing VenueSourcing document
export const uploadVenueImage = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || !mongoose.isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: "Invalid id" });
    }

    const imageFile = getFileFromRequest(req);
    if (!imageFile || !imageFile.buffer) {
      return res.status(400).json({ success: false, message: "No image file provided" });
    }

    const existing = await VenueSourcing.findById(id).lean();
    if (!existing) return res.status(404).json({ success: false, message: "VenueSourcing not found" });

    // Upload new image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "events", resource_type: "auto" },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.end(imageFile.buffer);
    });

    // Delete previous image in Cloudinary if present
    if (existing.hero && existing.hero.public_id) {
      try {
        await cloudinary.uploader.destroy(existing.hero.public_id, { resource_type: 'image' });
      } catch (e) {
        console.warn('Failed to delete previous Cloudinary image:', e.message || e);
      }
    }

    // Update only hero.image and hero.public_id, keep other relations unchanged
    const updated = await VenueSourcing.findByIdAndUpdate(
      id,
      { $set: { 'hero.image': result.secure_url, 'hero.public_id': result.public_id } },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Image uploaded', data: updated });
  } catch (err) {
    console.error('uploadVenueImage error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

