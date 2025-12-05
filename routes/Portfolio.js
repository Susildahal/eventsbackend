import {createPortfolioItem, getAllPortfolioItems, updatePortfolioItem, deletePortfolioItem} from '../controllers/portfolio.js';
import express from 'express';
import upload from '../middlewares/upload.js';
const portfolioRouter = express.Router();

portfolioRouter.post("/", upload.single('image'), createPortfolioItem);
portfolioRouter.get("/", getAllPortfolioItems);
portfolioRouter.put("/:id", upload.single('image'), updatePortfolioItem);
portfolioRouter.delete("/:id", deletePortfolioItem);

export default portfolioRouter;