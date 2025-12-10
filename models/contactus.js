import mongoose from "mongoose";    

const contactUsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        message: "Name is required"
    },
    email: {
        type: String,
        required: true,
        message: "Email is required"
    },
    phone: {
        type: String,
        required: true,
        message: "Phone number is required"
    },
    subject: {
        type: String,
        required: true,
        message: "Subject is required"
    },
    message: {
        type: String,
        required: true,
        message: "Message is required"
    },
    status: {
        type: Boolean,
        default: false,
    },
},
{  timestamps: true, }
);
const ContactUs = mongoose.model("ContactUs", contactUsSchema);

export default ContactUs;
