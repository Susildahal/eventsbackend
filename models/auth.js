import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,

    },
    email: {
        type: String,
        // required: true,
        unique: true,
    },
    password: {
        type: String,
        // required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    otp: {
        type: String,
    },
    otpExpiry: {
        type: Date,
    },


    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
},
{  timestamps: true, }
);

const User = mongoose.model("User", userSchema);

export default User;