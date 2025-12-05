import {deleteBooking ,getAllBookings ,getBookingById ,createBooking ,updateBooking} from '../controllers/booknow.js';

import express from 'express';
const booknowRouter = express.Router();
booknowRouter.post("/", createBooking);
booknowRouter.get("/", getAllBookings);
booknowRouter.get("/:id", getBookingById);
booknowRouter.delete("/:id", deleteBooking);
booknowRouter.put("/:id", updateBooking);
export default booknowRouter;

