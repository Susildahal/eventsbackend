import mongoose from "mongoose";

const previewSchema = new mongoose.Schema({
    portfolioId: {
        type:String,
        required: true,
    },
    name: {
        type: String,
        required: true, 
        message: "Title is required"
    },
    description: {  
        type: String,
        required: true,
        message: "Description is required"
    },
    star:{
        type: String,
        required: true,
        message: "Star rating is required"
    }

}   ,{  timestamps: true, }
);
const Preview = mongoose.model("Preview", previewSchema);
export default Preview;