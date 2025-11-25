import SiteSetting from "../models/sideSetting.js";

// Get site settings
export const getSiteSettings = async (req, res) => {
    try {
        const settings = await SiteSetting.findOne();
        if (!settings) {
            return res.status(404).json({ message: "Site settings not found" });
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error("Get Site Settings Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Create site settings
export const createSiteSettings = async (req, res) => {
    try {
        const { phone, email, location, address } = req.body;

        // Check if settings already exist
        const existingSettings = await SiteSetting.findOne();
        if (existingSettings) {
            return res.status(400).json({ message: "Site settings already exist. Use update instead." });
        }

        const newSettings = new SiteSetting({
            phone,
            email,
            location,
            address
        });

        await newSettings.save();
        res.status(201).json({ message: "Site settings created successfully", data: newSettings });
    } catch (error) {
        console.error("Create Site Settings Error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message || err.reason);
            return res.status(400).json({ message: "Validation error", errors: messages });
        }

        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Update site settings
export const updateSiteSettings = async (req, res) => {
    try {
        const { phone, email, location, address } = req.body;

        const updatedSettings = await SiteSetting.findOneAndUpdate(
            {},
            {
                phone,
                email,
                location,
                address
            },
            { new: true, runValidators: true }
        );

        if (!updatedSettings) {
            return res.status(404).json({ message: "Site settings not found" });
        }

        res.status(200).json({ message: "Site settings updated successfully", data: updatedSettings });
    } catch (error) {
        console.error("Update Site Settings Error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message || err.reason);
            return res.status(400).json({ message: "Validation error", errors: messages });
        }

        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Delete site settings
export const deleteSiteSettings = async (req, res) => {
    try {
        const deletedSettings = await SiteSetting.findOneAndDelete({});
        if (!deletedSettings) {
            return res.status(404).json({ message: "Site settings not found" });
        }
        res.status(200).json({ message: "Site settings deleted successfully" });
    } catch (error) {
        console.error("Delete Site Settings Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
