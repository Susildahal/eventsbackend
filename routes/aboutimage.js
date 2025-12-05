import {deleteAboutimageItem ,updateAboutimageItem ,getAboutimageItemById ,getAllAboutimageItems ,createaboutimage} from "../controllers/aboutimage.js";
import express from "express";
import upload from "../middlewares/upload.js";  
const aboutrouter = express.Router();

aboutrouter.post("/", upload.single("image"), createaboutimage);
aboutrouter.get("/", getAllAboutimageItems);
aboutrouter.get("/:id", getAboutimageItemById);
aboutrouter.put("/:id", upload.single("image"), updateAboutimageItem);
aboutrouter.delete("/:id", deleteAboutimageItem);
export default aboutrouter;

