import {createAboutUs ,updateAboutUs ,getAboutUs} from "../controllers/about.js"
import express from "express";
const aboutRouter = express.Router();

// Route to create or update About Us content
aboutRouter.post("/", createAboutUs);
aboutRouter.put("/:id", updateAboutUs);

// Route to get About Us content
aboutRouter.get("/", getAboutUs);
export default aboutRouter;