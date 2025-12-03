import EventsTypes from "../models/eventstypes.js";

export const savedEventTypes = async (req, res) => {
    const { name } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: "Event type name is required" });
        }
        const newEventType = new EventsTypes({ name });
        await newEventType.save();
        res.status(201).json({ message: "Event type saved successfully", data: newEventType });
    } catch (error) {
        console.error("Save Event Type Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}

export const getAllEventTypes = async (req, res) => {
    try {
        const eventTypes = await EventsTypes.find().sort({ createdAt: -1 });
        if (eventTypes.length === 0) {
            return res.status(404).json({ message: "No event types found" });
        }
        res.status(200).json({ data: eventTypes });
    } catch (error) {
        console.error("Get All Event Types Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};


// Delete an event type by ID
export const deleteEventTypeById = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedEventType = await EventsTypes.findByIdAndDelete(id);
        if (!deletedEventType) {
            return res.status(404).json({ message: "Event type not found" });
        }
        res.status(200).json({ message: "Event type deleted successfully" });
    } catch (error) {
        console.error("Delete Event Type Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
}


// Update site settings
export const updateeventTypes = async (req, res) => {
    const { name } = req.body;
    try {
        const { id } = req.params;
        const updatedEventType = await EventsTypes.findByIdAndUpdate(
            id,
            { name },
            { new: true, runValidators: true }
        );
        if (!updatedEventType) {
            return res.status(404).json({ message: "Event type not found" });
        }
        res.status(200).json({ message: "Event type updated successfully", data: updatedEventType });
    } catch (error) {
        console.error("Update Event Type Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};