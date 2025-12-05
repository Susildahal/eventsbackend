import mongoose from "mongoose";


const gallerySchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },

     
    }, { timestamps: true }
);
const Aboutimage = mongoose.model("Aboutimage", gallerySchema);
export default Aboutimage;