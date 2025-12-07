import  Preview from "../models/preview.js";
import {Portfolio} from "../models/portfolio.js";

// Create a new Preview
export const createPreview = async (req, res) => {
    const {id} = req.params;
    try {
        const {  name, description, star } = req.body;
        const existingPortfolio = await Portfolio.findById(id);
        if (!existingPortfolio) {
            return res.status(404).json({ message: "Portfolio not found" });
        }

        const newPreview = new Preview({
            portfolioId: id,
            name,
            description,
            star
        });
        await newPreview.save();
        res.status(201).json({ message: "Preview created successfully", data: newPreview });
    }
    catch (error) {
        console.error("Create Preview Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};


// Get all Previews
export const getAllPreviews = async (req, res) => {
    const {id} = req.params;
    try {
        const previews = await Preview.find({ portfolioId: id });
        res.status(200).json({ data: previews });
    }
    catch (error) {
        console.error("Get Previews Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Delete a Preview by ID
export const deletePreview = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedPreview = await Preview.findByIdAndDelete(id);
        if (!deletedPreview) {
            return res.status(404).json({ message: "Preview not found" });
        }
        res.status(200).json({ message: "Preview deleted successfully" });
    }
    catch (error) {
        console.error("Delete Preview Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }   
};
// Update a Preview by ID
export const updatePreview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedPreview = await Preview.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedPreview) {
            return res.status(404).json({ message: "Preview not found" });
        }
        res.status(200).json({ message: "Preview updated successfully", data: updatedPreview });
    } catch (error) {
        console.error("Update Preview Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};



