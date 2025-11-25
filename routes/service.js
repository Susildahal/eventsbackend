import { deleteService , getAllServices , getServiceById , createService , updateService } from '../controllers/service.js';
import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
const servicerouter = express.Router();

servicerouter.post("/", verifyToken, createService);
servicerouter.get("/", getAllServices);
servicerouter.get("/:id", getServiceById);
servicerouter.put("/:id", verifyToken, updateService);
servicerouter.delete("/:id", verifyToken, deleteService);
export default servicerouter;

