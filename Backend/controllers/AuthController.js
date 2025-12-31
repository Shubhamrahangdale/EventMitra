import Otp from "../models/Otp.js";
import Organizer from "../models/Organizer.js";
import bcrypt from "bcryptjs";
import { sendOtpEmail } from "../services/EmailService.js";

// 🔐 SEND OTP
export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await Otp.deleteMany({ email });

    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    });

    await sendOtpEmail(email, otp);

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    console.error("Send OTP Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    await Otp.deleteMany({ email });

    res.json({ success: true, message: "Email verified" });
  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// 🧾 REGISTER USER (AFTER OTP VERIFIED)
export const register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    const existingUser = await Organizer.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Organizer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      isVerified: true,
    });

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
