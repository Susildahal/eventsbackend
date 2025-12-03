import {updateServiceTypes ,deleteServiceTypeById ,getAllServiceTypes , savedServiceTypes ,getServiceTypeById} from '../controllers/servicetypes.js';
import express from 'express';
const serviceTypesRouter = express.Router();
// Route to save a new service type
serviceTypesRouter.post('/', savedServiceTypes);
// Route to get all service types
serviceTypesRouter.get('/', getAllServiceTypes);
// Route to delete a service type by ID
serviceTypesRouter.delete('/:id', deleteServiceTypeById);
// Route to update a service type by ID
serviceTypesRouter.put('/:id', updateServiceTypes);
// Route to get a service type by ID
serviceTypesRouter.get('/:id', getServiceTypeById);

export default serviceTypesRouter;

