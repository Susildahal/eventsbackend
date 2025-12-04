import Gallery from "../models/gallery.js";
import fs from "fs";
import path from "path";
import { cloudinary } from "../config/cloudinary.js";

const getPublicIdFromUrl = (url) => {
    if (!url) return null;
    const matches = url.match(/\/event-oc\/([^\.]+)/);
    return matches ? `event-oc/${matches[1]}` : null;
};

const ensureUploadsDir = async () => {
    const dir = path.join(process.cwd(), 'uploads');
    try {
        await fs.promises.access(dir);
    } catch (e) {
        await fs.promises.mkdir(dir, { recursive: true });
    }
    return dir;
};

const uploadBufferOrFile = async (file) => {
    if (!file) return null;
    if (file.path) return file.path;

    if (file.buffer) {
        if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET && process.env.CLOUDINARY_CLOUD_NAME) {
            return new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream({ folder: 'event-oc', format: 'webp' }, (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url || result.url);
                });
                uploadStream.end(file.buffer);
            });
        }

        const dir = await ensureUploadsDir();
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname) || '.jpg';
        const filename = `${file.fieldname || 'file'}-${unique}${ext}`;
        const filepath = path.join(dir, filename);
        await fs.promises.writeFile(filepath, file.buffer);
        return filepath;
    }

    return null;
};

export const createGalleryItem = async (req, res) => {
    try {
        const { title } = req.body;
        const image = await uploadBufferOrFile(req.file);
        if (!image) {
            return res.status(400).json({ message: "Image upload failed" });
        }
        console.log("Uploaded image path:", image);
        const newGalleryItem = new Gallery({ title, image });
        await newGalleryItem.save();

        res.status(201).json({ message: "Gallery item created successfully", data: newGalleryItem });
    } catch (error) {
        console.error('Create Gallery Error:', error);
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
    } catch (error) {
        console.error('Get All Gallery Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getGalleryItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const galleryItem = await Gallery.findById(id);
        if (!galleryItem) return res.status(404).json({ message: "Gallery item not found" });
        res.status(200).json({ data: galleryItem });
    } catch (error) {
        console.error('Get Gallery By ID Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const imageFile = req.file;

        if (!title && !imageFile) return res.status(400).json({ message: "At least one of title or image is required" });

        const galleryItem = await Gallery.findById(id);
        if (!galleryItem) return res.status(404).json({ message: "Gallery item not found" });

        let newImagePath = galleryItem.image;
        if (imageFile) {
            try {
                newImagePath = await uploadBufferOrFile(imageFile);
            } catch (e) {
                console.error('Error uploading new image:', e);
                return res.status(500).json({ message: 'Failed to upload new image' });
            }

            // Remove old image
            try {
                if (galleryItem.image && galleryItem.image.startsWith('http') && process.env.CLOUDINARY_API_KEY) {
                    const publicId = getPublicIdFromUrl(galleryItem.image);
                    if (publicId) await cloudinary.uploader.destroy(publicId);
                } else if (galleryItem.image) {
                    fs.unlink(galleryItem.image, (err) => { if (err) console.error('Error deleting old image file:', err); });
                }
            } catch (e) {
                console.error('Error deleting old image (non-blocking):', e);
            }
        }

        const updatedGalleryItem = await Gallery.findByIdAndUpdate(id, { title: title || galleryItem.title, image: newImagePath }, { new: true });
        res.status(200).json({ message: "Gallery item updated successfully", data: updatedGalleryItem });
    } catch (error) {
        console.error('Update Gallery Error:', error);
        res.status(500).json({ message: error.message });
    }
};

export const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedGalleryItem = await Gallery.findByIdAndDelete(id);
        if (!deletedGalleryItem) return res.status(404).json({ message: "Gallery item not found" });

        // Delete the image file associated with the deleted gallery item
        try {
            if (deletedGalleryItem.image && deletedGalleryItem.image.startsWith('http') && process.env.CLOUDINARY_API_KEY) {
                const publicId = getPublicIdFromUrl(deletedGalleryItem.image);
                if (publicId) await cloudinary.uploader.destroy(publicId);
            } else if (deletedGalleryItem.image) {
                fs.unlink(deletedGalleryItem.image, (err) => { if (err) console.error('Error deleting image file:', err); });
            }
        } catch (e) {
            console.error('Error deleting associated image (non-blocking):', e);
        }

        res.status(200).json({ message: "Gallery item deleted successfully" });
    } catch (error) {
        console.error('Delete Gallery Error:', error);
        res.status(500).json({ message: error.message });
    }
};
