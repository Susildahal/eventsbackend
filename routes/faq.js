import  { updateFaq ,deleteFaq ,getFaqById,getAllFaqs ,createFaq} from "../controllers/faq.js";

import express from "express";
const faqrouter = express.Router();

faqrouter.post("/", createFaq);
faqrouter.get("/", getAllFaqs);
faqrouter.get("/:id", getFaqById);
faqrouter.delete("/:id", deleteFaq);
faqrouter.put("/:id", updateFaq);

export default faqrouter;
