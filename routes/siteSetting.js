import express from 'express';
import {
    getSiteSettings,
    createSiteSettings,
    updateSiteSettings,
    deleteSiteSettings
} from '../controllers/siteSetting.js';
import { verifyToken } from '../middlewares/auth.js';
import { isAdmin } from '../middlewares/auth.js';

const settingsRouter = express.Router();

// Public routes
settingsRouter.get("/", getSiteSettings);

// Protected routes (require authentication)
settingsRouter.post("/", verifyToken, isAdmin, createSiteSettings);
settingsRouter.put("/", verifyToken, isAdmin, updateSiteSettings);
settingsRouter.delete("/", verifyToken, isAdmin, deleteSiteSettings);

export default settingsRouter;
