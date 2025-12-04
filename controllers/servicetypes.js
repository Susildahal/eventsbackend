import ServiceTypes from "../models/servicetypes.js";

export const savedServiceTypes = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Service type name is required" });
        }

        const isexist = await ServiceTypes.findOne({ name: name });
        if (isexist) {
            return res.status(400).json({ message: `Service type with the name "${name}" already exists` });
        }
        const newServiceType = new ServiceTypes({ name });
        await newServiceType.save();
        res.status(201).json({ message: "Service type saved successfully", data: newServiceType });
    } catch (error) {
        console.error("Save Service Type Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}

export const getAllServiceTypes = async (req, res) => {
    try {
        const serviceTypes = await ServiceTypes.find().sort({ createdAt: -1 });
        if (serviceTypes.length === 0) {
            return res.status(404).json({ message: "No service types found" });
        }
        res.status(200).json({ data: serviceTypes });
    } catch (error) {
        console.error("Get All Service Types Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};


// Delete a service type by ID
export const deleteServiceTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedServiceType = await ServiceTypes.findByIdAndDelete(id);
        if (!deletedServiceType) {
            return res.status(404).json({ message: "Service type not found" });
        }
        res.status(200).json({ message: "Service type deleted successfully" });
    } catch (error) {
        console.error("Delete Service Type Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}


// Update site settings
export const updateServiceTypes = async (req, res) => {
    const { name } = req.body;
    try {
        const { id } = req.params;
        const updatedServiceType = await ServiceTypes.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );
        if (!updatedServiceType) {
            return res.status(404).json({ message: "Service type not found" });
        }
        res.status(200).json({ message: "Service type updated successfully", data: updatedServiceType });
    } catch (error) {
        console.error("Update Service Type Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getServiceTypeById = async (req, res) => {
    try {
        const { id } = req.params;
        const serviceType = await ServiceTypes.findById(id);
        if (!serviceType) {
            return res.status(404).json({ message: "Service type not found" });
        }
        res.status(200).json({ data: serviceType });
    }
    catch (error) {
        console.error("Get Service Type By ID Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }   
};
