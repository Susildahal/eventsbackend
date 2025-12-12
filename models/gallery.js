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
        status: {
            type: Boolean,
            default: true,
        },
        
        public_id: {
            type: String,
          
        },

     
    }, { timestamps: true }
);
const Gallery = mongoose.model("Gallery", gallerySchema);
export default Gallery;