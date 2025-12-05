import mongoose from "mongoose";
const booknowSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            message: "Name is required",
        },
        email: {
            type: String,
            required: true,
            message: "Email is required",
        },
        phone: {
            type: String,
            required: true,
            message: "Phone number is required",
        },
        eventtype: {
            type: String,
            required: true,
            message: "Event type is required",

        },
        numberofpeople: {
            type: String,
            required: true,
            message: "Number of people is required",
        },


        eventdate: {
            type: Date,
            required: true,
            message: "Event date is required",
        },
    
        budget: {
            type: String,
            required: true,
            message: "Budget is required",
            enum: ['Low', 'Medium', 'High'],
            message : '{VALUE} is not supported',
        },
        budgetrange: {
            type: String,
            required: true,
            message: "Budget range is required",
        },
        message: {
            type: String,
            required: false,
        },
        needs: {
            type: [String],
        },
        contactMethod: {
             type: [String],
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled' ,'Completed'],
            default: 'Pending',
        },
    },
    { timestamps: true }
);
const Booknow = mongoose.model("Booknow", booknowSchema);
export default Booknow;






