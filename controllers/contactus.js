import ContactUs from "../models/contactus.js";

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newContact = new ContactUs({
            name,
            email,
            phone,
            subject,
            message
        });
        await newContact.save();
        res.status(201).json({ message: "Contact form submitted successfully", contact: newContact });
    }
    catch (error) {
        console.error("Contact Form Submission Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};


 export const getAllContacts = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    try {
        const contacts = await ContactUs.find().skip(skip).limit(limit);
        const total = await ContactUs.countDocuments();
        res.status(200).json({ data: contacts  , pagination: { page: page , limit: limit , total: total } });
    }
    catch (error) {
        console.error("Get Contacts Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getContactById = async (req, res) => {
    try {
        const contactId = req.params.id;
        const contact = await ContactUs.findById(contactId);
        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json(contact);
    }
    catch (error) {
        console.error("Get Contact By ID Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};


export const deleteContact = async (req, res) => {
    try {
        const contactId = req.params.id;
        const deletedContact = await ContactUs.findByIdAndDelete(contactId);
        if (!deletedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json({ message: "Contact deleted successfully" });
    }
    catch (error) {
        console.error("Delete Contact Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
 



