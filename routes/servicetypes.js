import {updateServiceTypes ,deleteServiceTypeById ,getAllServiceTypes , savedServiceTypes ,getServiceTypeById} from '../controllers/servicetypes.js';
import express from 'express';
import { verifyToken } from '../middlewares/auth.js';
const serviceTypesRouter = express.Router();
// Route to save a new service type
serviceTypesRouter.post('/', verifyToken, savedServiceTypes);
// Route to get all service types
serviceTypesRouter.get('/', getAllServiceTypes);
// Route to delete a service type by ID
serviceTypesRouter.delete('/:id', verifyToken, deleteServiceTypeById);
// Route to update a service type by ID
serviceTypesRouter.put('/:id', verifyToken, updateServiceTypes);
// Route to get a service type by ID
serviceTypesRouter.get('/:id', getServiceTypeById);

export default serviceTypesRouter;

