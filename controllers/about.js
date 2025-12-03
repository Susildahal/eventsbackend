import AboutUs from "../models/about.js"


// CREATE new About Us entry
export const createAboutUs = async (req, res) => {
  try {
    const data = await AboutUs.create(req.body);    
   const dataCount = await AboutUs.countDocuments();
   if(dataCount>1){
    return res.status(400).json({ success: false, message: "Only one About Us entry is allowed" });
   }
    res.status(201).json({
      success: true,
      message: "About Us created successfully",
      data:data,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}


export const getAboutUs = async (req, res) => {
    try {
        const data = await AboutUs.find();
        if (!data || data.length === 0) {
            return res.status(404).json({ success: false, message: "No About Us data found" });
        }
        res.status(200).json({ success: true, data: data });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
};


// UPDATE About Us entry
export const updateAboutUs = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await AboutUs.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "About Us entry not found",
      });
    }
    res.json({
      success: true,
      message: "About Us updated successfully",
      data: updated,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

