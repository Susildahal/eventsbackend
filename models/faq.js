import mongoose from "mongoose";

const faqSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        message: "Question is required"
    },
    answer: {
        type: String,
        required: true,
        message: "Answer is required"
    },
    title: {
        type: String,
        required: true,
        message: "Title is required"
    },
    

},
{  timestamps: true, }
);
const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
