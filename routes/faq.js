import  { updateFaq ,deleteFaq ,getFaqById,getAllFaqs ,createFaq ,toggleFaqStatus} from "../controllers/faq.js";

import express from "express";
const faqrouter = express.Router();

faqrouter.post("/", createFaq);
faqrouter.get("/", getAllFaqs);
faqrouter.get("/:id", getFaqById);
faqrouter.delete("/:id", deleteFaq);
faqrouter.put("/:id", updateFaq);
faqrouter.patch("/:id", toggleFaqStatus);

export default faqrouter;
