import Faq from "../models/faq.js";


export const createFaq = async (req, res) => {
    try {
        const { question, answer, title } = req.body;
        if (!question || !answer || !title) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newFaq = new Faq({
            question,
            answer,
            title
        });
        await newFaq.save();
        res.status(201).json({ message: "FAQ created successfully", data: newFaq });
    }
    catch (error) {
        console.error("Create FAQ Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
export const getAllFaqs = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;
    const title = req.query.title;
    const totalFaqs = await Faq.countDocuments();

    try {
        const faqs = await Faq.find(title ? { title: new RegExp(title, "i") } : {}).skip(skip).limit(limit);
        res.status(200).json({ data: faqs, pagination: { page, limit, total: totalFaqs } });
    }
    catch (error) {
        console.error("Get FAQs Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
export const getFaqById = async (req, res) => {
    try {
        const faqId = req.params.id;
        const faq = await Faq.findById(faqId);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        res.status(200).json({ data: faq });
    }
    catch (error) {
        console.error("Get FAQ By ID Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}
export const deleteFaq = async (req, res) => {
    try {
        const faqId = req.params.id;
        const deletedFaq = await Faq.findByIdAndDelete(faqId);
        if (!deletedFaq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        res.status(200).json({ message: "FAQ deleted successfully" });
    }
    catch (error) {

        console.error("Delete FAQ Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const updateFaq = async (req, res) => {
    try {
        const faqId = req.params.id;
        const updatedData = req.body;
        const updatedFaq = await Faq.findByIdAndUpdate(faqId, updatedData, { new: true });
        if (!updatedFaq) {
            return res.status(404).json({ message: "FAQ not found" });
        }       
        res.status(200).json(updatedFaq);
    } catch (error) {
        console.error("Update FAQ Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}

