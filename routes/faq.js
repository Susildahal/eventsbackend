import  { updateFaq ,deleteFaq ,getFaqById,getAllFaqs ,createFaq ,toggleFaqStatus} from "../controllers/faq.js";
import { verifyToken } from "../middlewares/auth.js";

import express from "express";
const faqrouter = express.Router();

faqrouter.post("/", verifyToken, createFaq);
faqrouter.get("/", getAllFaqs);
faqrouter.get("/:id", getFaqById);
faqrouter.delete("/:id", verifyToken, deleteFaq);
faqrouter.put("/:id", verifyToken, updateFaq);
faqrouter.patch("/:id", verifyToken, toggleFaqStatus);

export default faqrouter;
