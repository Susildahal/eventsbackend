import AboutUs from "../models/about.js";
import { cloudinary } from "../config/cloudinary.js";

const parseJSONField = (v) => {
  if (!v) return v;
  if (typeof v === 'string') {
    try {
      return JSON.parse(v);
    } catch (e) {
      return v;
    }
  }
  return v;
};

const getFileFromRequest = (req, fieldName) => {
  // prefer specific field if provided
  if (fieldName && req.files) {
    const f = req.files.find(x => x.fieldname === fieldName);
    if (f) return f;
  }
  if (req.file) return req.file;
  if (req.files && req.files.length) return req.files[0];
  return null;
};

const uploadBuffer = async (buffer) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'about-images', resource_type: 'image' }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    stream.end(buffer);
  });
  return result;
};

// CREATE new About Us entry
export const createAboutUs = async (req, res) => {
  try {
    // Expect req.body.data as JSON string containing the full payload
    let body = {};
    if (req.body.data) {
      try {
        body = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid JSON in 'data' field" });
      }
    } else {
      // Fallback: parse individual fields if no 'data' field
      body = { ...req.body };
      ['hero', 'missionVision', 'whatWeBelieve', 'theOcMethod', 'sustainability', 'technology', 'budgets', 'images'].forEach(k => {
        if (body[k]) body[k] = parseJSONField(body[k]);
      });
    }

    // Handle uploaded images and append to body.images
    const files = req.files || [];
    body.images = body.images || [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.buffer) continue;
      const uploaded = await uploadBuffer(file.buffer);
      body.images.push({ id: String(body.images.length + 1), url: uploaded.secure_url, public_id: uploaded.public_id });
    }

    const dataCount = await AboutUs.countDocuments();
    if (dataCount > 0) {
      return res.status(400).json({ success: false, message: "Only one About Us entry is allowed" });
    }

    const data = await AboutUs.create(body);
    res.status(201).json({ success: true, message: "About Us created successfully", data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


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
    // Expect req.body.data as JSON string containing the full payload
    let body = {};
    if (req.body.data) {
      try {
        body = JSON.parse(req.body.data);
      } catch (e) {
        return res.status(400).json({ success: false, message: "Invalid JSON in 'data' field" });
      }
    } else {
      // Fallback: parse individual fields if no 'data' field
      body = { ...req.body };
      ['hero', 'missionVision', 'whatWeBelieve', 'theOcMethod', 'sustainability', 'technology', 'budgets', 'images'].forEach(k => {
        if (body[k]) body[k] = parseJSONField(body[k]);
      });
    }

    // Handle uploaded images and append to images array (do not overwrite existing unless specified)
    const files = req.files || [];
    const existing = await AboutUs.findById(id);
    if (!existing) return res.status(404).json({ success: false, message: 'About Us entry not found' });

    body.images = body.images || [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.buffer) continue;
      const uploaded = await uploadBuffer(file.buffer);
      body.images.push({ id: String((existing.images || []).length + body.images.length + 1), url: uploaded.secure_url, public_id: uploaded.public_id });
    }

    // Merge existing and body.images
    if (existing.images && existing.images.length) {
      body.images = [...existing.images, ...body.images];
    }

    const updated = await AboutUs.findByIdAndUpdate(id, body, { new: true });
    res.json({ success: true, message: "About Us updated successfully", data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

