import {createPortfolioItem, getAllPortfolioItems, updatePortfolioItem, deletePortfolioItem ,savePortfolioimage ,getimage ,deleteimage , updateimage ,getPortfolioItemById ,updatestatus} from '../controllers/portfolio.js';
import express from 'express';
import upload from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/auth.js';
const portfolioRouter = express.Router();

portfolioRouter.post("/", upload.single('image'), verifyToken, createPortfolioItem);
portfolioRouter.get("/",  getAllPortfolioItems);
portfolioRouter.get("/:id",  getPortfolioItemById);
portfolioRouter.put("/:id", upload.single('image'), verifyToken, updatePortfolioItem);
portfolioRouter.delete("/:id", verifyToken, deletePortfolioItem);
portfolioRouter.post("/image/:id/", upload.single('image'), verifyToken, savePortfolioimage);
portfolioRouter.get("/image/:id/",getimage);
portfolioRouter.delete("/image/:id/", verifyToken, deleteimage);
portfolioRouter.put("/image/:id/", upload.single('image'), verifyToken, updateimage);
portfolioRouter.patch("/:id", verifyToken, updatestatus);

export default portfolioRouter;