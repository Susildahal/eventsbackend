import User from "../models/auth.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import transporter from "../config/nodemiler.js"
import { v2 as cloudinary } from "cloudinary";

const generateotp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
}



export const register = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;
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
            address,
            phone

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
        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "12h" });
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
            return res.status(401).json({ message: "User not found" });
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

export const forgotpassword = async (req, res) => {

    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const otp = generateotp();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        // Send OTP via styled HTML email
        const mailOptions = {
            from: `"Events Team" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Password Reset OTP",
            html: `
                  <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px; border-radius: 8px; max-width: 480px; margin: 0 auto; border: 1px solid #eee;">
                    <h2 style="color: #2d7ff9; margin-bottom: 8px;">Password Reset Request</h2>
                    <p style="font-size: 16px; color: #333;">Hello,</p>
                    <p style="font-size: 16px; color: #333;">We received a request to reset your password. Please use the following OTP to reset your password:</p>
                    <div style="margin: 24px 0; text-align: center;">
                      <span style="display: inline-block; font-size: 32px; letter-spacing: 8px; color: #fff; background: #2d7ff9; padding: 12px 32px; border-radius: 6px; font-weight: bold;">${otp}</span>
                    </div>
                    <p style="font-size: 15px; color: #555;">This OTP is valid for <b>10 minutes</b>. If you did not request a password reset, you can safely ignore this email.</p>
                    <p style="font-size: 14px; color: #aaa; margin-top: 32px;">Thank you,<br>The Events Team</p>
                  </div>
              `,
        };
        
        // Save user first before sending email
        await user.save();
        
        // Send email with better error handling
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", info.messageId);
            res.status(200).json({ message: `OTP sent to ${email}` });
        } catch (emailError) {
            console.error("Email sending failed:", emailError);
            // Even if email fails, OTP is saved, inform user
            res.status(200).json({ 
                message: `OTP generated but email delivery may be delayed. Please check your spam folder.`,
                warning: "Email service experiencing issues"
            });
        }
    }
    catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const checkotp = async (req, res) => {

    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, otp, otpExpiry: { $gt: new Date() } });
        if (!user) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        user.otpExpiry = undefined;
        await user.save();
        res.status(200).json({ message: "OTP is valid" });
    }
    catch (error) {
        console.error("Check OTP Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const resetpassword = async (req, res) => {

    try {
        const { email, newPassword, otp } = req.body;
        if (!otp || !newPassword) {
            return res.status(400).json({ message: "OTP and new password are required" });
        }
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        user.otp = undefined;
        const hashedPassword = await bcrypt.hash(String(newPassword), 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password reset successfully" });
    }
    catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: error.message || "Server error" });
    }
};

export const updateuser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, role, address, phone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { name, email, password, role, address, phone },
            { new: true }
        );;
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User updated successfully", data: updatedUser });
    }
    catch (error) {
        console.error("Update User Error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        res.status(500).json({ message: error.message || "Server error" });
    }
};
export const updateuserstatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.status = !user.status;
        await user.save();
        res.status(200).json({ message: "User status updated successfully", data: user });
    }
    catch (error) {
        console.error("Update User Status Error:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user id' });
        }
        res.status(500).json({ message: error.message || "Server error" });
    }
};





export const profile = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address } = req.body;

  try {
    // 1. Find user
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imageUrl = user.profilePicture; 
    let publicId = user.publicId;

    // 2. If a new file is uploaded → upload to Cloudinary
    if (req.file) {
      // Delete old image on Cloudinary if exists
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }

      // Upload new image
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "events", resource_type: "auto" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    // 3. Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        phone,
        address,
        profilePicture: imageUrl,
        publicId: publicId,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Profile Update Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};

