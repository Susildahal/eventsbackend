import {createEvent,getEvents ,getEventById,updateEvent,deleteEvent ,updateStatus} from '../controllers/events.js';
import express from 'express';
import upload from '../middlewares/upload.js';
import { verifyToken } from '../middlewares/auth.js';
const eventrouter = express.Router();




eventrouter.post("/", verifyToken, upload.single('coverImage'), createEvent);
eventrouter.get("/", getEvents);
eventrouter.get("/:id", getEventById);
eventrouter.put("/:id", verifyToken, upload.single('coverImage'), updateEvent);
eventrouter.delete("/:id", verifyToken, deleteEvent);
eventrouter.patch("/:id", verifyToken, updateStatus);
export default eventrouter;