import User from "../models/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "12h" });
    res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
};


 export const getallusers = async (req, res) => {

    try {
        const users = await User.find().select("-password").sort({ createdAt: -1 });
        res.status(200).json({ data: users });
    }
    catch (error) {

        res.status(500).json({ message: error.message || "Server error" });
    }
}
export const deleteuser = async (req, res) => {

    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id); 
        if (!deletedUser) {

            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (error) {

        console.error("Delete User Error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const mee = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
}


export const updatepassowrd = async (req, res) => {

    try {
        const { id } = req.params;
        const { oldPassword, password } = req.body;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
    // Validate input
    if (!oldPassword || !password) {
      return res.status(400).json({ message: 'Both oldPassword and password are required' });
    }

    // Ensure values are strings to avoid bcrypt errors
    const oldPwdStr = String(oldPassword);

    const updatepassword = await bcrypt.compare(oldPwdStr, user.password);
        if (!updatepassword) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }
    // Hash the new password and update
    const hashedPassword = await bcrypt.hash(String(password), 10);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Password updated successfully", data: updatedUser });
    }
    catch (error) {
        console.error("Update Password Error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        } 
        res.status(500).json({ message: error.message || "Server error" });
    }
};