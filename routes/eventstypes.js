import {updateeventTypes ,deleteEventTypeById ,getAllEventTypes ,savedEventTypes ,getEventTypeById} from "../controllers/evetstypes.js";
import express from "express";
const eventTypesRouter = express.Router();

// Route to save a new event type
eventTypesRouter.post("/", savedEventTypes);
// Route to get all event types
eventTypesRouter.get("/", getAllEventTypes);
// Route to get an event type by ID
eventTypesRouter.get("/:id", getEventTypeById);
// Route to delete an event type by ID
eventTypesRouter.delete("/:id", deleteEventTypeById);
// Route to update an event type by ID
eventTypesRouter.put("/:id", updateeventTypes);
export default eventTypesRouter;

