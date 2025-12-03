import {updateVenueSourcing ,createVenueSourcing ,getVenueSourcing} from "../controllers/servicedashbord.js";
import express from "express";
const servicedashbordRouter = express.Router();

// Route to create a new venue sourcing entry
servicedashbordRouter.post("/", createVenueSourcing);
// Route to update an existing venue sourcing entry by ID
servicedashbordRouter.put("/:id", updateVenueSourcing);

// Route to get the venue sourcing entry
servicedashbordRouter.get("/", getVenueSourcing);
export default servicedashbordRouter;