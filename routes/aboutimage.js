import {deleteAboutimageItem ,updateAboutimageItem ,getAboutimageItemById ,getAllAboutimageItems ,createaboutimage} from "../controllers/aboutimage.js";
import express from "express";
import upload from "../middlewares/upload.js";  
import { verifyToken } from "../middlewares/auth.js";
const aboutrouter = express.Router();

aboutrouter.post("/", upload.single("image"), verifyToken, createaboutimage);
aboutrouter.get("/", getAllAboutimageItems);
aboutrouter.get("/:id",  getAboutimageItemById);
aboutrouter.put("/:id", upload.single("image"), verifyToken, updateAboutimageItem);
aboutrouter.delete("/:id", verifyToken, deleteAboutimageItem);
export default aboutrouter;

