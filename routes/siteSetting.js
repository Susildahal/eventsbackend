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
settingsRouter.post("/",  createSiteSettings);
settingsRouter.put("/",  updateSiteSettings);
settingsRouter.delete("/",  deleteSiteSettings);

export default settingsRouter;
