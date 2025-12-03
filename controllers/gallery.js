import Gallery from "../models/gallery.js";
import fs from "fs";

export const createGalleryItem = async (req, res) => {
    try {
        const { title } = req.body;
        const image =req.file.path;
        const newGalleryItem = new Gallery({ title, image });
        await newGalleryItem.save();
        res.status(201).json({ message: "Gallery items created successfully", newGalleryItem });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllGalleryItems = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const title = req.query.title || "";
    try {
        const totalItems = await Gallery.countDocuments({ title: { $regex: title, $options: "i" } });
        const galleryItems = await Gallery.find({ title: { $regex: title, $options: "i" } }).skip(skip).limit(limit);
        res.status(200).json({ data: galleryItems, pagination: { total: totalItems, page, limit } });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getGalleryItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const galleryItem = await Gallery.findById(id);
        if (!galleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.status(200).json({ data: galleryItem });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const image = req.file.path;
         
 if (!title || !image) {
            return res.status(400).json({ message: "Title and image are required" });
        }   
            const galleryItem = await Gallery.findById(id);
            if (!galleryItem) {
                return res.status(404).json({ message: "Gallery item not found" });
            }
            // Delete the old image file
            fs.unlink(galleryItem.image, (err) => {
                if (err) {
                    console.error("Error deleting old image file:", err);
                }
            });
            
         
        const updatedGalleryItem = await Gallery.findByIdAndUpdate(
            id,
            { title, image },
            { new: true }
        );
        if (!updatedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        res.status(200).json({ message :"Gallery item updated successfully", data: updatedGalleryItem });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGalleryItem = await Gallery.findByIdAndDelete(id);
        if (!deletedGalleryItem) {
            return res.status(404).json({ message: "Gallery item not found" });
        }
        // Delete the image file associated with the deleted gallery item
        fs.unlink(deletedGalleryItem.image, (err) => {
            if (err) {
                console.error("Error deleting image file:", err);
            }
        });
        res.status(200).json({ message: "Gallery item deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
