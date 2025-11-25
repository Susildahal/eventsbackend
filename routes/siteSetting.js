import express from 'express';
import {
    getSiteSettings,
    createSiteSettings,
    updateSiteSettings,
    deleteSiteSettings
} from '../controllers/siteSetting.js';
import { verifyToken } from '../middlewares/auth.js';

const settingsRouter = express.Router();

// Public routes
settingsRouter.get("/", getSiteSettings);

// Protected routes (require authentication)
settingsRouter.post("/", verifyToken, createSiteSettings);
settingsRouter.put("/", verifyToken, updateSiteSettings);
settingsRouter.delete("/", verifyToken, deleteSiteSettings);

export default settingsRouter;
