
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
        message: "Title is required",
        enum: ['General', 'Cancellation', 'Premits', 'Catering'],
        message : '{VALUE} is not supported',
    },
    status: {
        type: Boolean,
        default: true,
    },
    

},
{  timestamps: true, }
);
const Faq = mongoose.model("Faq", faqSchema);

export default Faq;
