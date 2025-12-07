import {updatePreview ,deletePreview ,getAllPreviews,createPreview} from '../controllers/preview.js';
import express from 'express';
const previewRouter = express.Router();


previewRouter.post("/:id", createPreview);
previewRouter.get("/:id", getAllPreviews);
previewRouter.delete("/:id", deletePreview);
previewRouter.put("/:id", updatePreview);

export default previewRouter;