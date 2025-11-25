import Service from "../models/service.js";


export const createService = async (req, res) => {
    try {
        const { serviceName, description, price, image, isactive } = req.body;
        const newService = new Service({
            serviceName,
            description,
            price,
            image,
            isactive
        });
        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllServices = async (req, res) => {
    try {
        const services = await Service.find();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getServiceById = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const service = await Service.findById(serviceId);      
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};  

export const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const updatedData = req.body;
        const updatedService = await Service.findByIdAndUpdate(serviceId, updatedData, { new: true });
        if (!updatedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(updatedService);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const deletedService = await Service.findByIdAndDelete(serviceId);
        if (!deletedService) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json({ message: "Service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};