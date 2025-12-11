import mongoose from "mongoose";
import User from "../models/auth.js";
import bcrypt from "bcryptjs";
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected successfully");
    // Ensure there's no leftover unique index on serviceid.id that causes E11000 for null
    try {
const user = await User.find();

if (user.length === 0) {
  const adminUser = new User({
    name: process.env.username || "Admin",
    email: process.env.email,
    role: process.env.role || "admin",
    address: process.env.address,
    phone: process.env.phone,
    status:true,
    
    password: await bcrypt.hash(process.env.password, 10)
  });
  await adminUser.save();
}
    } catch (error) {
      console.error("user already exist:", error);
      }
   
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;