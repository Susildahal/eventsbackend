import {Portfolio , PortfolioImage} from "../models/portfolio.js";
import { cloudinary } from "../config/cloudinary.js";

const uploadBuffer = async (buffer) => {
  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'portfolio', resource_type: 'image' }, (err, res) => {
      if (err) return reject(err);
      resolve(res);
    });
    stream.end(buffer);
  });
  return result;
};


 export const createPortfolioItem = async (req, res) => {
    try {
        const { title, description, } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }
const imageFile = req.file;
        let imageUrl = "";
        let uploaded;
        if (imageFile) {
            // Assuming you have a function to upload the image and get the URL
            uploaded = await uploadBuffer(imageFile.buffer);
            imageUrl = uploaded.secure_url;
        } else {
            return res.status(400).json({ message: "Image file is required" });
        }
        const item = new Portfolio({
            title,
            description,    
            image: imageUrl,
            public_id: uploaded.public_id,
        });
        await item.save();
        res.status(201).json({ message: "Portfolio item created", data: item });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPortfolioItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Portfolio.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Portfolio item not found" });
        }
        res.status(200).json({ data: item });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const getAllPortfolioItems = async (req, res) => {
    try {
        const items = await Portfolio.find();
        res.status(200).json({ data: items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, image } = req.body;
        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const item = await Portfolio.findById(id);
        if (!item) {
            return res.status(404).json({ message: "Portfolio item not found" });
        }

        let updateData = { title, description };

        if (req.file) {
            // Delete old image
            if (item.public_id) {
                await cloudinary.uploader.destroy(item.public_id);
            }
            const uploaded = await uploadBuffer(req.file.buffer);
            updateData.image = uploaded.secure_url;
            updateData.public_id = uploaded.public_id;
        } else if (image) {
            updateData.image = image;
        }

        const updated = await Portfolio.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json({ message: "Portfolio item updated", data: updated });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePortfolioItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await Portfolio.findByIdAndDelete(id);
        if (!item) {
            return res.status(404).json({ message: "Portfolio item not found" });
        }
        if (item.public_id) {
            await cloudinary.uploader.destroy(item.public_id);
        }
        res.status(200).json({ message: "Portfolio item deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};




export const  savePortfolioimage = async (req, res) => {
    try {
        const { id } = req.params;
        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({ message: "Image file is required" });
        }
        const uploaded = await uploadBuffer(imageFile.buffer);

        const portfolioImage = new PortfolioImage({
            portfolioId: id,
            image: uploaded.secure_url,
            public_id: uploaded.public_id,
        });
        await portfolioImage.save();
        res.status(200).json({ imageUrl: uploaded.secure_url, public_id: uploaded.public_id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


 export const getimage = async (req, res) => {
  try {
    const {id} = req.params;
    const data = await PortfolioImage.find({ portfolioId: id });
    if (!data) {
      return res.status(404).json({ message: "Image not found" });
    }
    res.status(200).json({ data: data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteimage = async (req, res) => {
    try {
        const { id } = req.params;
        const imageItem = await PortfolioImage.findByIdAndDelete(id);
        if (!imageItem) {
            return res.status(404).json({ message: "Image item not found" });
        }
        if (imageItem.public_id) {
            await cloudinary.uploader.destroy(imageItem.public_id);
        }
        res.status(200).json({ message: "Image item deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateimage = async (req, res) => {
    try {
        const { id } = req.params;
        const imageFile = req.file;
        if (!imageFile) {
            return res.status(400).json({ message: "Image file is required" });
        }
        const imageItem = await PortfolioImage.findById(id);
        if (!imageItem) {
            return res.status(404).json({ message: "Image item not found" });
        }
        if (imageItem.public_id) {
            await cloudinary.uploader.destroy(imageItem.public_id);
        }
        const uploaded = await uploadBuffer(imageFile.buffer);
        imageItem.image = uploaded.secure_url;
        imageItem.public_id = uploaded.public_id;
        await imageItem.save();
        res.status(200).json({ message: "Image item updated", data: imageItem });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};