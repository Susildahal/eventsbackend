import mongoose from "mongoose";
const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        message:" Title is required"
    },
    slug: {
        type: String,
        required: true,
        message:" Slug is required"
    },
    date: {
        type: String,
        required: true, 
        message:" Date is required"
    },
    eventypes: {
        type: String,
        required: true,  
        enum: ['Birthday', 'Beach and pool', 'Branch Launch', 'Night Music' ,'Custom'],
    },
    location: {   
        type: String,
        required: true,
        message:" Location is required"
    },
    shortSummary: {
        type: String,
        required: true, 
        message:" Short Summary is required"
    },
    detailDescription: {
        type: String,
        required: true, 
        message:" Detail Description is required"
    },
    coverImage: {
        type: String,
        required: false, 
        message:" Cover Image is required"
    },
    coverImagePublicId: {
        type: String,
        required: false,
    },
    galleryImages: [{
        type: String,
    }],

    reviewsText:{
        type: String,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    status: {
        type: Boolean,
        default: true,
    },
},
{  timestamps: true, }
);
const Event = mongoose.model("Event", eventSchema);

export default Event;
