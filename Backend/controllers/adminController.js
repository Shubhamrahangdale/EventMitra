import jwt from "jsonwebtoken";
import Organizer from "../models/Organizer.js";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@eventmitra.com"; 
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  
/* ================= ADMIN LOGIN ================= */
export const adminLogin = (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      message: "Invalid admin credentials ❌",
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Admin login successful ✅",
    token,
  });
};


/* ================= GET PENDING ORGANISERS ================= */
export const getPendingOrganisers = async (req, res) => {
  try {
    const organisers = await Organizer.find({ status: "pending" });
    res.json(organisers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organisers" });
  }
};

/* ================= APPROVE ORGANISER ================= */
export const approveOrganiser = async (req, res) => {
  try {
    const organiser = await Organizer.findById(req.params.id);

    if (!organiser) {
      return res.status(404).json({ message: "Organiser not found" });
    }

    organiser.status = "active";
    await organiser.save();

    res.json({ message: "Organiser approved ✅" });
  } catch (err) {
    res.status(500).json({ message: "Approval failed ❌" });
  }
};

/* ================= GET ALL ORGANISERS ================= */
export const getAllOrganisers = async (req, res) => {
  try {
    const organisers = await Organizer.find();
    res.json(organisers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organisers" });
  }
};
