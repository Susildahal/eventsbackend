import {deleteGalleryItem, updateGalleryItem , getGalleryItemById, createGalleryItem, getAllGalleryItems ,toggleGalleryItemStatus} from '../controllers/gallery.js';

import express from 'express';
const galleryRouter = express.Router();
import upload from '../middlewares/upload.js';


galleryRouter.post("/", upload.single("image"), createGalleryItem);
galleryRouter.get("/", getAllGalleryItems);
galleryRouter.get("/:id", getGalleryItemById);
galleryRouter.delete("/:id", deleteGalleryItem);
galleryRouter.put("/:id", upload.single("image"), updateGalleryItem);
galleryRouter.patch("/:id", toggleGalleryItemStatus);

export default galleryRouter;