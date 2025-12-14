import {deleteGalleryItem, updateGalleryItem , getGalleryItemById, createGalleryItem, getAllGalleryItems ,toggleGalleryItemStatus} from '../controllers/gallery.js';
import { verifyToken } from '../middlewares/auth.js';

import express from 'express';
const galleryRouter = express.Router();
import upload from '../middlewares/upload.js';


galleryRouter.post("/", upload.single("image"), verifyToken, createGalleryItem);
galleryRouter.get("/", getAllGalleryItems);
galleryRouter.get("/:id",  getGalleryItemById);
galleryRouter.delete("/:id", verifyToken, deleteGalleryItem);
galleryRouter.put("/:id", upload.single("image"), verifyToken, updateGalleryItem);
galleryRouter.patch("/:id", verifyToken, toggleGalleryItemStatus);

export default galleryRouter;