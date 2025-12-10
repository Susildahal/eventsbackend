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
    // Build filter object so the same filter can be used for both count and find
    const filter = {};
    if (title) {
        filter.title = new RegExp(title, "i");
    }
    const status = req.query.status;
    if (status === "true") {
        filter.status = true;
    } else if (status === "false") {
        filter.status = false;
    }

    try {
        // Count documents matching the filter (important for correct pagination)
        const totalFaqs = await Faq.countDocuments(filter);

        // Fetch page of results
        const faqs = await Faq.find(filter).skip(skip).limit(limit);
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

export const toggleFaqStatus = async (req, res) => {
    try {
        const faqId = req.params.id;
        const faq = await Faq.findById(faqId);
        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }
        faq.status = !faq.status;
        await faq.save();
        res.status(200).json({ message: "FAQ status updated successfully", data: faq });
    }
    catch (error) {
        console.error("Toggle FAQ Status Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
function parseJSONField(field) {
    if (typeof field === 'string') {
        try {
            return JSON.parse(field);
        } catch (e) {
            console.warn("Failed to parse JSON field:", field);
            return field; // Return original if parsing fails
        }
    }
    return field;
}