import {createEvent,getEvents ,getEventById,updateEvent,deleteEvent ,updateStatus} from '../controllers/events.js';
import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
const eventrouter = express.Router();




eventrouter.post("/", verifyToken,  createEvent);
eventrouter.get("/", getEvents);
eventrouter.get("/:id", getEventById);
eventrouter.put("/:id", verifyToken, updateEvent);
eventrouter.delete("/:id", verifyToken, deleteEvent);
eventrouter.patch("/:id", verifyToken, updateStatus);
export default eventrouter;