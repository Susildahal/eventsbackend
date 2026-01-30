import ContactUs from "../models/contactus.js";
import SiteSetting from "../models/sideSetting.js";
import transporter from "../config/nodemiler.js";

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        if (!name || !email || !phone || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }
        console.log("Contact Form Data:", req.body);
        const newContact = new ContactUs({
            name,
            email,
            phone,
            subject,
            message
        });

        // Send email notification (use verified sender as `from`, set replyTo to user)
        const siteSetting = await SiteSetting.findOne({});
        const notifyEmail = siteSetting?.bookingEmail || siteSetting?.email || process.env.SMTP_EMAIL;
const mailOptions = {
    from: `"Events Team" <${process.env.SMTP_EMAIL}>`,
    to: notifyEmail,
    replyTo: `${name} <${email}>`,
    subject: `📩 New Contact: ${subject}`,
    // Plain text fallback for old mail clients
    text: `New submission from ${name} (${email}): ${message}`, 
    // Professional HTML Layout
    html: `
    <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px; padding: 20px;">
        <h2 style="color: #333; border-bottom: 2px solid #4A90E2; padding-bottom: 10px;">New Contact Form Submission</h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
                <td style="padding: 10px 0; color: #777; width: 100px;"><strong>From:</strong></td>
                <td style="padding: 10px 0; color: #333;">${name}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #777;"><strong>Email:</strong></td>
                <td style="padding: 10px 0; color: #333;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #777;"><strong>Phone:</strong></td>
                <td style="padding: 10px 0; color: #333;">${phone}</td>
            </tr>
            <tr>
                <td style="padding: 10px 0; color: #777;"><strong>Subject:</strong></td>
                <td style="padding: 10px 0; font-weight: bold; color: #333;">${subject}</td>
            </tr>
        </table>

        <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 5px; color: #444; line-height: 1.6;">
            <strong>Message:</strong><br/>
            ${message.replace(/\n/g, '<br/>')}
        </div>

        <div style="margin-top: 30px; text-align: center;">
            <a href="mailto:${email}" style="background-color: #4A90E2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reply Directly to User
            </a>
        </div>
        
        <p style="font-size: 12px; color: #aaa; margin-top: 30px; text-align: center;">
            Submitted via the website contact form on ${new Date().toLocaleString()}
        </p>
    </div>
    `
};

        try {
            if (!notifyEmail) {
                console.warn('No notifyEmail configured; skipping notification email.');
            } else {
                const info = await transporter.sendMail(mailOptions);
                console.log('Contact notification sent:', info && info.messageId ? info.messageId : info);
            }

        } catch (mailErr) {
            console.error('Failed to send contact notification email:', mailErr && mailErr.message ? mailErr.message : mailErr);
        }

        // Save contact regardless of email result
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
        const contacts = await ContactUs.find().skip(skip).limit(limit).sort({ createdAt: -1 });
        const totalunread = await ContactUs.countDocuments({ status: false });
        
        const total = await ContactUs.countDocuments();
        res.status(200).json({ data: contacts  , unread: totalunread, pagination: { page: page , limit: limit , total: total } });
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
 

 export const patchContactStatus = async (req, res) => {
const {id} = req.params;
    try {
       
        const { status } = req.body;
        const updatedContact = await ContactUs.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }
        res.status(200).json({ message: "Contact status updated successfully", contact: updatedContact });
    }
    catch (error) {
        console.error("Update Contact Status Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const deleteBulkContacts = async (req, res) => {
    try {
        const { ids } = req.body; // Expecting an array of IDs in the request body
        const result = await ContactUs.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: `${result.deletedCount} contacts deleted successfully` });
    }
    catch (error) {
        console.error("Bulk Delete Contacts Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};



