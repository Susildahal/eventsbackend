import Booknow from "../models/booknow.js";
import transporter from "../config/nodemiler.js";

export const createBooking = async (req, res) => {
    try {
        const { name, email, phone, eventdate, eventtype, budgetrange, needs, contactMethod, status, budget, numberofpeople } = req.body;
        console.log(req.body);

        // Send booking confirmation email
        const mailOptions = {
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: "🎉 Booking Confirmation - Event Received!",
            html: `
  <div style="
    font-family: Arial, sans-serif;
    background:#f4f4f4;
    padding:25px;
  ">
    <div style="
      max-width:600px;
      margin:0 auto;
      background:white;
      border-radius:10px;
      overflow:hidden;
      box-shadow:0 3px 10px rgba(0,0,0,0.1);
    ">
      
      <div style="background:#7c3aed; padding:20px; text-align:center;">
        <h2 style="color:#fff; margin:0;">Event Booking Confirmation</h2>
      </div>

      <div style="padding:20px;">
        <p style="font-size:15px; margin-bottom:15px;">Hello <b>${name}</b>,</p>
        <p style="font-size:15px; margin-bottom:15px;">
          🎉 We have successfully received your event booking!  
        </p>

        <h3 style="color:#7c3aed; margin-bottom:10px;">Booking Details:</h3>
        <table style="width:100%; border-collapse:collapse; margin-bottom:15px;">
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Event Date</td>
            <td style="padding:8px; border:1px solid #ddd;">${eventdate}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Event Type</td>
            <td style="padding:8px; border:1px solid #ddd;">${eventtype}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Budget</td>
            <td style="padding:8px; border:1px solid #ddd;">${budget}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Number of People</td>
            <td style="padding:8px; border:1px solid #ddd;">${numberofpeople}</td>
          </tr>
          <tr>
            <td style="padding:8px; border:1px solid #ddd;">Contact Method</td>
            <td style="padding:8px; border:1px solid #ddd;">${contactMethod}</td>
          </tr>
        </table>

        <p style="font-size:15px;">
          We will contact you soon with further details. 
          If you need urgent help, feel free to reply to this email.
        </p>

        <p style="margin-top:20px; font-size:14px;">
          Regards, <br />
          <b>Your Events Team</b>
        </p>
      </div>

      <div style="background:#7c3aed; text-align:center; padding:10px;">
        <p style="color:#fff; font-size:13px; margin:0;">
          © ${new Date().getFullYear()} Your Company | All Rights Reserved
        </p>
      </div>
    </div>
  </div>
  `
        };

        await transporter.sendMail(mailOptions);

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

        // Normalize `contactMethod`
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

    } catch (error) {
        console.error("Create Booking Error:", error);

        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(e => ({ path: e.path, message: e.message }));
            return res.status(400).json({ message: 'Validation error', errors });
        }

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

        // Find old booking data
        const oldBooking = await Booknow.findById(id);
        if (!oldBooking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Update booking
        const updatedBooking = await Booknow.findByIdAndUpdate(id, updatedData, { new: true });

        // Send Email Only When Status Changed
        if (updatedData.status && updatedData.status !== oldBooking.status) {

            const mailOptions = {
                from: process.env.SMTP_EMAIL,
                to: updatedBooking.email,
                subject: `📢 Booking Status Updated - ${updatedBooking.status}`,
                html: `
                <div style="font-family: Arial, sans-serif; background:#fafafa; padding:25px;">
                <div style="
                    max-width:600px;
                    margin:0 auto;
                    background:white;
                    padding:20px;
                    border-radius:8px;
                    box-shadow:0 3px 8px rgba(0,0,0,0.1);
                ">
                    <h2 style="text-align:center; color:#7c3aed;">Booking Status Update</h2>

                    <p>Hello <b>${updatedBooking.name}</b>,</p>
                    <p>Your booking status has been updated to:</p>

                    <h3 style="color:#7c3aed; text-align:center;">${updatedBooking.status}</h3>

                    <p>For any queries, feel free to reply to this email.</p>

                    <br/>
                    <p>Regards,</p>
                    <p><b>Events Team</b></p>
                </div>
                </div>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.status(200).json({ message: "Booking updated successfully & email sent (if status changed)", data: updatedBooking });

    } catch (error) {
        console.error("Update Booking Error:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid booking id' });
        }

        res.status(500).json({ message: error.message || "Server error" });
    }
}

