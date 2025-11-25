import Event from "../models/events.js";

export const createEvent = async (req, res) => {
    try {
        const eventData = req.body;
        console.log("Event Data:", eventData);
        const newEvent = new Event(eventData);
        const coverImageFile = req.file;
        
        if (coverImageFile) {
            newEvent.coverImage = coverImageFile.path; // Save the file path to the event document
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
    try {
        const events = await Event.find();
        const total = await Event.countDocuments();
        res.status(200).json({ data: events, total });
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
            updatedData.coverImage = coverImageFile.path;
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

