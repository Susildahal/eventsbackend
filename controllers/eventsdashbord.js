import EventBirthday from "../models/eventsdashbord.js";
import { cloudinary } from "../config/cloudinary.js";

const uploadBuffer = async (buffer) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'events-dashboard', resource_type: 'image' }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    stream.end(buffer);
  });
  return result;
};

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

export const saveEventBirthday = async (req, res) => {
    try {
        const body = { ...req.body };
        ['services', 'concepts', 'timeline', 'faqs', 'eventsid'].forEach(k => {
            if (body[k]) body[k] = parseJSONField(body[k]);
        });

 const eventsid  = req.body?.eventsid?.id; ;
 const isExisting = await EventBirthday.findOne({ 'eventsid.id': eventsid });
 if (isExisting) {
    return res.status(400).json({ message: "Event Birthday data with this eventsid.id already exists. Use update instead." });
 }
        // Parse hero separately to handle nested fields
        if (body.hero) {
            body.hero = parseJSONField(body.hero);
        }
        if (body.hero && body.hero.contents) {
            body.hero.contents = parseJSONField(body.hero.contents);
        }

        // Handle hero image upload
        const files = req.files || [];
        const heroImageFile = files.find(f => f.fieldname === 'hero[image]');
        if (heroImageFile) {
            const uploaded = await uploadBuffer(heroImageFile.buffer);
            body.hero = body.hero || {};
            body.hero.image = uploaded.secure_url;
            body.hero.public_id = uploaded.public_id;
        }

        // Handle concepts images upload
        if (body.concepts && Array.isArray(body.concepts)) {
            for (let i = 0; i < body.concepts.length; i++) {
                const conceptImageFile = files.find(f => f.fieldname === `concepts[${i}][image]`);
                if (conceptImageFile) {
                    const uploaded = await uploadBuffer(conceptImageFile.buffer);
                    body.concepts[i].image = uploaded.secure_url;
                    body.concepts[i].public_id = uploaded.public_id;
                }
            }
        }

        const newEventBirthday = new EventBirthday(body);
        await newEventBirthday.save();
        res.status(201).json({ message: "Event Birthday data saved successfully", data: newEventBirthday });
    } catch (error) {
        console.error("Save Event Birthday Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const getEventBirthday = async (req, res) => {
    const { id } = req.params;
    const { title } = req.query;

    try {
        const filter = {};
        if (id) {
            filter['eventsid.id'] = new RegExp(id, "i");
        }
        if (title) {
            filter['eventsid.name'] = new RegExp(title, "i");
        }

        const eventBirthdays = await EventBirthday.find(filter).sort({ createdAt: -1 });
        if (eventBirthdays.length === 0) {
            return res.status(404).json({ message: "No event birthday data found" });
        }
       res.status(201).json({ data: eventBirthdays.map(e => e.toObject()) });
    } catch (error) {
        console.error("Get Event Birthday Data Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const updateEventBirthday = async (req, res) => {
    try {
        const { id } = req.params;
        const filter = {};
        if (id) {
            filter['eventsid.id'] = new RegExp(id, "i");
        }

        const body = { ...req.body };
        ['services', 'concepts', 'timeline', 'faqs', 'eventsid'].forEach(k => {
            if (body[k]) body[k] = parseJSONField(body[k]);
        });

        // Parse hero separately to handle nested fields
        if (body.hero) {
            body.hero = parseJSONField(body.hero);
        }
        if (body.hero && body.hero.contents) {
            body.hero.contents = parseJSONField(body.hero.contents);
        }

        const existing = await EventBirthday.findById(id);
        if (!existing) {
            return res.status(404).json({ message: "Event Birthday data not found" });
        }

        // Handle hero image upload
        const files = req.files || [];
        const heroImageFile = files.find(f => f.fieldname === 'hero[image]');
        if (heroImageFile) {
            if (existing.hero && existing.hero.public_id) {
                await cloudinary.uploader.destroy(existing.hero.public_id);
            }
            const uploaded = await uploadBuffer(heroImageFile.buffer);
            body.hero = body.hero || {};
            body.hero.image = uploaded.secure_url;
            body.hero.public_id = uploaded.public_id;
        } else if (body.hero && body.hero.image && typeof body.hero.image === 'string' && body.hero.image.startsWith('http')) {
            // Keep existing image URL if sent
        }

        // Handle concepts images upload
        if (body.concepts && Array.isArray(body.concepts)) {
            for (let i = 0; i < body.concepts.length; i++) {
                const conceptImageFile = files.find(f => f.fieldname === `concepts[${i}][image]`);
                if (conceptImageFile) {
                    if (existing.concepts[i] && existing.concepts[i].public_id) {
                        await cloudinary.uploader.destroy(existing.concepts[i].public_id);
                    }
                    const uploaded = await uploadBuffer(conceptImageFile.buffer);
                    body.concepts[i].image = uploaded.secure_url;
                    body.concepts[i].public_id = uploaded.public_id;
                }
            }
        }

        const updated = await EventBirthday.findByIdAndUpdate(id, body, { new: true });
        res.status(200).json({ message: "Event Birthday data updated successfully", data: updated });
    } catch (error) {
        console.error("Update Event Birthday Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};