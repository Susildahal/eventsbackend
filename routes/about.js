import { createAboutUs, updateAboutUs, getAboutUs } from "../controllers/about.js";
import express from "express";
import upload from "../middlewares/upload.js";
import { verifyToken } from "../middlewares/auth.js";

const aboutRouter = express.Router();

// Route to create or update About Us content (accept images as multipart files)
aboutRouter.post("/", upload.any(), verifyToken, createAboutUs);
aboutRouter.put("/:id", upload.any(), verifyToken, updateAboutUs);

// Route to get About Us content
aboutRouter.get("/", getAboutUs);
export default aboutRouter;