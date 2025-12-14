import {saveEventBirthday, getEventBirthday, updateEventBirthday} from "../controllers/eventsdashbord.js";
import upload from "../middlewares/upload.js";
import express from "express";
import { verifyToken } from "../middlewares/auth.js";


const eventsDashboardRouter = express.Router();

eventsDashboardRouter.post("/", upload.any(), verifyToken, saveEventBirthday);
eventsDashboardRouter.get("/", getEventBirthday);
eventsDashboardRouter.get("/:id", getEventBirthday);
eventsDashboardRouter.put("/:id", upload.any(), verifyToken, updateEventBirthday);

export default eventsDashboardRouter;
