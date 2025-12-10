import mongoose from "mongoose";

const EventBirthdaySchema = new mongoose.Schema(
    {

        hero: {
            description: String,
            image: String,
            public_id: String,
            title: String,
            subtitle: String,
            contents: [
                {
                    title: String,
                    description: String,
                },
            ],
        },
        faqs: [
            {
                id: Number,
                question: String,
                answer: String,
            },
        ],
        eventsid: {
            id: String,
            name: String,
        },
    },
    { timestamps: true }
);

export default mongoose.model("EventBirthday", EventBirthdaySchema);
