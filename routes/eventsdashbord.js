import {saveEventBirthday, getEventBirthday, updateEventBirthday} from "../controllers/eventsdashbord.js";
import upload from "../middlewares/upload.js";
import express from "express";

const eventsDashboardRouter = express.Router();

eventsDashboardRouter.post("/", upload.any(), saveEventBirthday);
eventsDashboardRouter.get("/", getEventBirthday);
eventsDashboardRouter.get("/:id", getEventBirthday);
eventsDashboardRouter.put("/:id", upload.any(), updateEventBirthday);

export default eventsDashboardRouter;
