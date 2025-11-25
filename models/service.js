import mongoose from "mongoose";

const  serviceSchema = new mongoose.Schema({
    serviceName: {
        type: String,
        required: true,
        message:" Service Name is required"
    },
    description: {
        type: String,
        required: true,
        message:" Description is required"  
    },
    price: {
        type: Number,

        required: true,
        message:" Price is required"  
    },  
    image : {
        type: String,
        required: false,
        message:" Image is required"  
    },
    isactive: {
        type: Boolean,
        default: true,
    },
},
{  timestamps: true, }
);

const Service = mongoose.model("Service", serviceSchema);

export default Service;