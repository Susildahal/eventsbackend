import {updateeventTypes ,deleteEventTypeById ,getAllEventTypes ,savedEventTypes ,getEventTypeById} from "../controllers/evetstypes.js";
import express from "express";
const eventTypesRouter = express.Router();
import { verifyToken } from "../middlewares/auth.js";

// Route to save a new event type
eventTypesRouter.post("/", verifyToken, savedEventTypes);
// Route to get all event types
eventTypesRouter.get("/", getAllEventTypes);
// Route to get an event type by ID
eventTypesRouter.get("/:id", getEventTypeById);
// Route to delete an event type by ID
eventTypesRouter.delete("/:id", verifyToken, deleteEventTypeById);
// Route to update an event type by ID
eventTypesRouter.put("/:id", verifyToken, updateeventTypes);
export default eventTypesRouter;

