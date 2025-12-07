import {createPortfolioItem, getAllPortfolioItems, updatePortfolioItem, deletePortfolioItem ,savePortfolioimage ,getimage ,deleteimage , updateimage ,getPortfolioItemById} from '../controllers/portfolio.js';
import express from 'express';
import upload from '../middlewares/upload.js';
const portfolioRouter = express.Router();

portfolioRouter.post("/", upload.single('image'), createPortfolioItem);
portfolioRouter.get("/", getAllPortfolioItems);
portfolioRouter.get("/:id", getPortfolioItemById);
portfolioRouter.put("/:id", upload.single('image'), updatePortfolioItem);
portfolioRouter.delete("/:id", deletePortfolioItem);
portfolioRouter.post("/image/:id/", upload.single('image'), savePortfolioimage);
portfolioRouter.get("/image/:id/", getimage);
portfolioRouter.delete("/image/:id/", deleteimage);
portfolioRouter.put("/image/:id/", upload.single('image'), updateimage);

export default portfolioRouter;