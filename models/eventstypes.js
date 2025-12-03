import mongoose from "mongoose";

const EventsTypesSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
},
  { timestamps: true }
);
const EventsTypes = mongoose.model("EventsTypes", EventsTypesSchema);

export default EventsTypes;