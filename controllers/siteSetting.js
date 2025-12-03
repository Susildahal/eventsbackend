import SiteSetting from "../models/sideSetting.js";

// Get site settings
export const getSiteSettings = async (req, res) => {
    try {
        const settings = await SiteSetting.findOne();
        if (!settings) {
            return res.status(404).json({ message: "Site settings not found" });
        }
        res.status(200).json(settings);
    } catch (error) {
        console.error("Get Site Settings Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Create site settings
export const createSiteSettings = async (req, res) => {
    try {
        const { phone, email, location, address , siteName, socialMedia, siteDescription } = req.body;
        const normalize = (input) => {
            if (!input) return [];
            // If already an array of objects
            if (Array.isArray(input)) return input;
            // If it's an object map, convert to array of values
            if (typeof input === 'object') {
                return Object.values(input);
            }
            if (typeof input === 'string') {
                // Try JSON.parse first
                try {
                    const parsed = JSON.parse(input);
                    if (Array.isArray(parsed)) return parsed;
                    if (typeof parsed === 'object') return Object.values(parsed).length ? Object.values(parsed) : [parsed];
                } catch (e) {
                    // Try to coerce a JS-object-like string to JSON by quoting keys and converting single quotes
                    try {
                        let s = input.trim();
                        // Replace single quotes around values to double quotes
                        s = s.replace(/'([^']*)'/g, '"$1"');
                        // Quote unquoted keys: { key: -> { "key":
                        s = s.replace(/([,{\s])(\w+)\s*:/g, '$1"$2":');
                        const parsed2 = JSON.parse(s);
                        if (Array.isArray(parsed2)) return parsed2;
                        if (typeof parsed2 === 'object') return Object.values(parsed2).length ? Object.values(parsed2) : [parsed2];
                    } catch (e2) {
                        // As a last resort, try to parse comma-separated string of urls/icons? We'll return empty
                        return [];
                    }
                }
            }
            return [];
        };

        const parsedSocialMedia = normalize(socialMedia);

        // Check if settings already exist
        const existingSettings = await SiteSetting.findOne();
        if (existingSettings) {
            return res.status(400).json({ message: "Site settings already exist. Use update instead." });
        }

        const newSettings = new SiteSetting({
            phone,
            email,
            location,
            address,
            siteName,
            socialMedia: parsedSocialMedia,
            siteDescription
        });

        await newSettings.save();
        res.status(201).json({ message: "Site settings created successfully", data: newSettings });
    } catch (error) {
        console.error("Create Site Settings Error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => ({ path: err.path, message: err.message || err.reason }));
            return res.status(400).json({ message: "Validation error", errors: messages });
        }

        // Handle Mongoose CastError (wrong type / invalid id)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid value provided', path: error.path, value: error.value });
        }

        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Update site settings
export const updateSiteSettings = async (req, res) => {
    try {
        const { phone, email, location, address , siteName, socialMedia, siteDescription } = req.body;

        // reuse normalization logic used in create
        const normalize = (input) => {
            if (!input) return [];
            if (Array.isArray(input)) return input;
            if (typeof input === 'object') return Object.values(input);
            if (typeof input === 'string') {
                try {
                    const parsed = JSON.parse(input);
                    if (Array.isArray(parsed)) return parsed;
                    if (typeof parsed === 'object') return Object.values(parsed).length ? Object.values(parsed) : [parsed];
                } catch (e) {
                    try {
                        let s = input.trim();
                        s = s.replace(/'([^']*)'/g, '"$1"');
                        s = s.replace(/([,{\s])(\w+)\s*:/g, '$1"$2":');
                        const parsed2 = JSON.parse(s);
                        if (Array.isArray(parsed2)) return parsed2;
                        if (typeof parsed2 === 'object') return Object.values(parsed2).length ? Object.values(parsed2) : [parsed2];
                    } catch (e2) {
                        return [];
                    }
                }
            }
            return [];
        };

        const parsedSocialMediaUpdate = normalize(socialMedia);

        const updatedSettings = await SiteSetting.findOneAndUpdate(
            {},
            {
                phone,
                email,
                location,
                address,
                siteName,
                socialMedia: parsedSocialMediaUpdate,
                siteDescription
            },
            { new: true, runValidators: true }
        );

        if (!updatedSettings) {
            return res.status(404).json({ message: "Site settings not found" });
        }

        res.status(200).json({ message: "Site settings updated successfully", data: updatedSettings });
    } catch (error) {
        console.error("Update Site Settings Error:", error);

        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => ({ path: err.path, message: err.message || err.reason }));
            return res.status(400).json({ message: "Validation error", errors: messages });
        }

        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid value provided', path: error.path, value: error.value });
        }

        res.status(500).json({ message: error.message || "Server error" });
    }
};

// Delete site settings
export const deleteSiteSettings = async (req, res) => {
    try {
        const deletedSettings = await SiteSetting.findOneAndDelete({});
        if (!deletedSettings) {
            return res.status(404).json({ message: "Site settings not found" });
        }
        res.status(200).json({ message: "Site settings deleted successfully" });
    } catch (error) {
        console.error("Delete Site Settings Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};
