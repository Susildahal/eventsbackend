import {deleteBooking ,getAllBookings ,getBookingById ,createBooking ,updateBooking} from '../controllers/booknow.js';
import { verifyToken } from '../middlewares/auth.js';
import express from 'express';
const booknowRouter = express.Router();
booknowRouter.post("/",  createBooking);
booknowRouter.get("/",  getAllBookings);
booknowRouter.get("/:id",  getBookingById);
booknowRouter.delete("/:id", verifyToken, deleteBooking);
booknowRouter.put("/:id", verifyToken, updateBooking);
export default booknowRouter;

