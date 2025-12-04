import { updateVenueSourcing, createVenueSourcing, getVenueSourcing, uploadVenueImage } from "../controllers/servicedashbord.js";
import express from "express";
import upload from "../middlewares/upload.js";

const servicedashbordRouter = express.Router();

// Route to create a new venue sourcing entry (accepts any multipart file field)
servicedashbordRouter.post("/", upload.any(), createVenueSourcing);
// Route to update an existing venue sourcing entry by ID (accepts any multipart file field)
servicedashbordRouter.put("/:id", upload.any(), updateVenueSourcing);
// Route to upload/replace only the hero image for an existing VenueSourcing
servicedashbordRouter.post("/:id/image", upload.any(), uploadVenueImage);

// Route to get the venue sourcing entry
servicedashbordRouter.get("/", getVenueSourcing);

export default servicedashbordRouter;