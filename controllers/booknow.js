import Booknow from "../models/booknow.js";

export const createBooking = async (req, res) => {
    try {
        const { name, email, phone, eventdate, eventtype, budgetrange, needs, contactMethod , status ,budget ,numberofpeople } = req.body;
        console.log(req.body);

       
        let parsedNeeds = [];
        if (Array.isArray(needs)) {
            parsedNeeds = needs.map(n => String(n).trim()).filter(Boolean);
        } else if (typeof needs === 'string') {
            try {
                const parsed = JSON.parse(needs);
                if (Array.isArray(parsed)) parsedNeeds = parsed.map(n => String(n).trim()).filter(Boolean);
                else if (parsed && typeof parsed === 'object') parsedNeeds = Object.keys(parsed).map(k => String(k).trim()).filter(Boolean);
                else parsedNeeds = String(parsed).split(',').map(s => s.trim()).filter(Boolean);
            } catch (e) {
                parsedNeeds = needs.split(',').map(s => s.trim()).filter(Boolean);
            }
        } else if (needs && typeof needs === 'object') {
            parsedNeeds = Object.keys(needs).map(k => String(k).trim()).filter(Boolean);
        }

        // Normalize `contactMethod` if it's a JSON string
        let parsedContacts = contactMethod;
        if (typeof contactMethod === 'string') {
            try {
                parsedContacts = JSON.parse(contactMethod);
            } catch (e) {
                parsedContacts = contactMethod;
            }
        }

        const newBooking = new Booknow({
            name,
            email,
            phone,
            eventdate,
            budgetrange,
            needs: parsedNeeds,
            contactMethod: parsedContacts,
            status,
            budget,
            numberofpeople,
            eventtype
        });
        await newBooking.save();
        res.status(201).json({ message: "Booking created successfully", data: newBooking });
    }
    catch (error) {
        console.error("Create Booking Error:", error);
        // Handle Mongoose validation errors with 400 and a list of messages
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => ({ path: e.path, message: e.message }));
            return res.status(400).json({ message: 'Validation error', errors });
        }

        // Handle CastError (invalid ObjectId or wrong type)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid value for field', path: error.path, value: error.value });
        }

        res.status(500).json({ message: error.message || "Server error" });
    }
};


export const getAllBookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // 1) Pagination filters
    const filter = req.query.status ? { status: req.query.status } : {};

    // 2) Stats in ONE query
    const statsAggregate = await Booknow.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // 3) Format stats
    const stats = {
      totalCancelled: statsAggregate.find(x => x._id === 'Cancelled')?.count || 0,
      totalPending: statsAggregate.find(x => x._id === 'Pending')?.count || 0,
      totalCompleted: statsAggregate.find(x => x._id === 'Completed')?.count || 0,
      totalConfirmed: statsAggregate.find(x => x._id === 'Confirmed')?.count || 0
    };

    // 4) Total bookings count (filtered)
    const total = await Booknow.countDocuments(filter);

    // 5) Paginated bookings
    const bookings = await Booknow.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      data: bookings,
      stats,
      pagination: { total, page, limit }
    });

  } catch (error) {
    res.status(500).json({
      message: error.message || "Server error"
    });
  }
};

export const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booknow.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ data: booking });
    }
    catch (error) {
        console.error("Get Booking By ID Error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid booking id' });
        }
        res.status(500).json({ message: error.message || "Server error" });
    }
}

export const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booknow.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
    }
    catch (error) {
        console.error("Delete Booking Error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid booking id' });
        }
        res.status(500).json({ message: error.message || "Server error" });
    }
};

 
 export const updateBooking = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedBooking = await Booknow.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }   
        res.status(200).json({ message: "Booking updated successfully", data: updatedBooking });
    } catch (error) {
        console.error("Update Booking Error:", error);  
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid booking id' });
        }
        res.status(500).json({ message: error.message || "Server error" });
    }
}
