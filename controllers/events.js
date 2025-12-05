import Event from "../models/events.js";
import { cloudinary } from "../config/cloudinary.js";

const uploadBuffer = async (buffer) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'events', resource_type: 'image' }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    stream.end(buffer);
  });
  return result;
};

export const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        console.log("Event Data:", eventData);
        const newEvent = new Event(eventData);
        const coverImageFile = req.file;
        
        if (coverImageFile) {
            const uploaded = await uploadBuffer(coverImageFile.buffer);
            newEvent.coverImage = uploaded.secure_url;
            newEvent.coverImagePublicId = uploaded.public_id;
        }
        
        await newEvent.save();
        res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
        console.error("Create Event Error:", error);
        
        // Handle validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message || err.reason);
            return res.status(400).json({ message: "Validation error", errors: messages });
        }
        
        res.status(500).json({ message: error.message || "Server error" });
    }
}


export const getEvents = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    try {
        const events = await Event.find().skip(skip).limit(limit);
        const total = await Event.countDocuments();
        res.status(200).json({ data: events, pagination: { page, limit, total } });
    } catch (error) {
        console.error("Get Events Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}

export const getEventById = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Get Event By ID Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}
export const updateEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const updatedData = req.body;
        const coverImageFile = req.file;
        if (coverImageFile) {
            const uploaded = await uploadBuffer(coverImageFile.buffer);
            updatedData.coverImage = uploaded.secure_url;
            updatedData.coverImagePublicId = uploaded.public_id;
        } else if (updatedData.image) {
            // If no file but image URL sent, use it
            updatedData.coverImage = updatedData.image;
            delete updatedData.image; // Remove the image field
        }
        const updatedEvent = await Event.findByIdAndUpdate(eventId, updatedData, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error("Update Event Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}   
export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;  
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Delete Event Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
export const updateStatus = async (req, res) => {
    const {id} = req.params;
    try {
        const updateEvent = await Event.findById(id);
        if(!updateEvent){
            return res.status(404).json({message:"Event not found"});
        }
        updateEvent.status = !updateEvent.status;
        await updateEvent.save();
        res.status(200).json({message:"Status updated successfully", event:updateEvent});
    } catch (error) {
        console.error("Update Status Error:", error);
        
        if (error.kind === "ObjectId") {
            return res.status(400).json({message: "Invalid event ID"});
        }
        
        res.status(500).json({message: error.message || "Server error"});
    }
}

