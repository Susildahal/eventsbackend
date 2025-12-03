import mongoose from "mongoose";

const siteSettingSchema = new mongoose.Schema({
    phone: {
        type: String,
    },
    email: {
        type: String,
      
    },
    location: {
        type: String,
   
    },
    address: {
        type: String,
        message: "Address"
    },

    siteName: {
        type: String,

    },
    // Allow an array of social media objects with url and icon fields
    socialMedia: [{
        url: { type: String },
        icon: { type: String },
        name: { type: String}
    }],
    siteDescription:{
        type:String,        
    },
    

},
{ timestamps: true }
);

const SiteSetting = mongoose.model("SiteSetting", siteSettingSchema);

export default SiteSetting;
