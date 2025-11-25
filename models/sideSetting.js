import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        message: "Phone number is required"
    },
    email: {
        type: String,
        required: true,
        match: [/.+@.+\..+/, "Please provide a valid email"],
        message: "Email is required"
    },
    location: {
        type: String,
        required: true,
        message: "Location is required"
    },
    address: {
        type: String,
        message: "Address"
    }
},
{ timestamps: true }
);

const SiteSetting = mongoose.model("SiteSetting", siteSettingSchema);

export default SiteSetting;
