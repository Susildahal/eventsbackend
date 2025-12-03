import VenueSourcing from "../models/servicedashboard.js";

// CREATE new Venue Sourcing (used only first time)
export const createVenueSourcing = async (req, res) => {
  try {
    const data = await VenueSourcing.create(req.body);

    res.status(201).json({
      success: true,
      message: "Venue Sourcing created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
  
};

// UPDATE Venue Sourcing (used every time after first)
export const updateVenueSourcing = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await VenueSourcing.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.json({
      success: true,
      message: "Venue Sourcing updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


export const getVenueSourcing = async (req, res) => {
  try {
    const serviceid = req.query.serviceid;

    console.log("Service ID:", serviceid);

    if (!serviceid) {
      return res.status(400).json({ message: "serviceid is required" });
    }

    // Correct filter for nested field
    const filter = { "serviceid.id": serviceid };

    const data = await VenueSourcing.findOne(filter);

    if (!data) {
      return res.status(404).json({ message: "No data found for this serviceid" });
    }

    res.status(200).json({ data });

  } catch (error) {
    console.error("Get Venue Sourcing Error:", error);
    res.status(500).json({ message: error.message || "Server error" });
  }
};

