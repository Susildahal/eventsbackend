import Booknow from "../models/booknow.js";
import transporter from "../config/nodemiler.js";
import SiteSetting from "../models/sideSetting.js";

// Create a new booking

export const createBooking = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      eventdate,
      eventtype,
      budgetrange,
      needs,
      contactMethod,
      status,
      budget,
      numberofpeople,
      message
    } = req.body;

    // 🔹 Check if booking already exists for the date
    const ifDateExists = await Booknow.findOne({ eventdate });
    if (ifDateExists) {
      return res.status(400).json({
        message: "A booking already exists for the selected event date."
      });
    }

    // 🔹 Get Events OC Team Email from Site Settings
    const siteSetting = await SiteSetting.findOne({});
    const adminEmail = siteSetting?.email;

    if (!adminEmail) {
      return res.status(400).json({ message: "Admin email not configured" });
    }

    // 🔹 Parse Needs
    let parsedNeeds = [];
    if (Array.isArray(needs)) {
      parsedNeeds = needs;
    } else if (typeof needs === "string") {
      parsedNeeds = needs.split(",").map(n => n.trim());
    }

    // 🔹 Normalize contact method
    let parsedContactMethod = contactMethod;
    if (typeof contactMethod === "string") {
      try {
        parsedContactMethod = JSON.parse(contactMethod);
      } catch {
        parsedContactMethod = contactMethod;
      }
    }

    // 🔹 Save booking
    const newBooking = new Booknow({
      name,
      email,
      phone,
      eventdate,
      eventtype,
      budgetrange,
      needs: parsedNeeds,
      contactMethod: parsedContactMethod,
      status,
      budget,
      numberofpeople,
      message

    });

    await newBooking.save();

    /* ==========================
       📧 EMAIL TO USER
    ========================== */
    const userMailOptions = {
      from: `"Events Team" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: "🎉 Your Event Booking is Confirmed",
      html: `
      <div style="font-family:Arial;background:#f4f4f4;padding:25px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:8px;">
          <div style="background:#7c3aed;color:#fff;padding:20px;text-align:center;">
            <h2>Booking Confirmed 🎉</h2>
          </div>

          <div style="padding:20px;">
            <p>Hello <b>${name}</b>,</p>
            <p>We have successfully received your booking request.</p>

            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="border:1px solid #ddd;padding:8px;">Event Date</td><td style="border:1px solid #ddd;padding:8px;">${eventdate}</td></tr>
              <tr><td style="border:1px solid #ddd;padding:8px;">Event Type</td><td style="border:1px solid #ddd;padding:8px;">${eventtype}</td></tr>
              <tr><td style="border:1px solid #ddd;padding:8px;">Budget</td><td style="border:1px solid #ddd;padding:8px;">${budget}</td></tr>
              <tr><td style="border:1px solid #ddd;padding:8px;">Guests</td><td style="border:1px solid #ddd;padding:8px;">${numberofpeople}</td></tr>
            </table>

            <p style="margin-top:15px;">
              Our team will contact you shortly.
            </p>

            <p>Regards,<br/><b>Events Team</b></p>
          </div>
        </div>
      </div>
      `
    };

    /* ==========================
       📧 EMAIL TO ADMIN / EVENTS OC TEAM
    ========================== */
    const adminMailOptions = {
      from: `"Booking System" <${process.env.SMTP_EMAIL}>`,
      to: adminEmail,
      subject: "📩 New Event Booking Received",
      html: `
      <div style="font-family:Arial;">
        <h2>New Booking Alert 🚨</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Phone:</b> ${phone}</p>
        <p><b>Event Date:</b> ${eventdate}</p>
        <p><b>Event Type:</b> ${eventtype}</p>
        <p><b>Budget Range:</b> ${budgetrange}</p>
        <p><b>Budget:</b> ${budget}</p>
        <p><b>Guests:</b> ${numberofpeople}</p>
        <p><b>Contact Method:</b> ${parsedContactMethod}</p>
        <p><b>Needs:</b> ${parsedNeeds.join(", ")}</p>
      </div>
      `
    };

    // 🔹 Send Emails (Do not block booking)
    try {
      await transporter.sendMail(userMailOptions);
      await transporter.sendMail(adminMailOptions);
      console.log("User & Admin emails sent successfully");
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    // 🔹 Final Response
    res.status(201).json({
      message: "Booking created successfully",
      data: newBooking
    });

  } catch (error) {
    console.error("Create Booking Error:", error);
    res.status(500).json({
      message: error.message || "Server error"
    });
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
                from: `"Events Team" <${process.env.SMTP_EMAIL}>`,
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

            try {
                const info = await transporter.sendMail(mailOptions);
                console.log("Status update email sent:", info.messageId);
            } catch (emailError) {
                console.error("Failed to send status update email:", emailError);
                // Continue even if email fails
            }
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

