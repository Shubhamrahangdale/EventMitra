import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import Organizer from "./models/Organizer.js";
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import organizerRoutes from "./routes/OrganizerRoutes.js";
import adminAuth from "./middleware/adminAuth.js";
import authRoutes from "./routes/AuthRoutes.js";



const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.SECRET_KEY;



console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "NOT LOADED");


/* ================= for Database connection ================= */
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch(() => console.log("MongoDB Error ❌"));



  // 👇 ADD BELOW THIS
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@eventmitra.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

//making seperate tables

const attendeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String
});


// const organizerSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   password: String,
//   status: {
//     type: String,
//     enum: ["pending", "active", "inactive"],
//     default: "pending"
//   },
//   subscription: {
//     plan: { type: String, default: "none" },
//     status: { type: String, default: "pending" },
//     amount: { type: Number, default: 0 },
//     eventsAllowed: { type: Number, default: 0 }
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });




const Attendee = mongoose.model("Attendee", attendeeSchema);
// const Organizer = mongoose.model("Organizer", organizerSchema);


app.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!["attendee", "organizer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role ❌" });
    }

  const emailRegex = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._+\-$]+(?<!\.)@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Check your mail ✉️🔎",
      });
    }


    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        message: "Mobile number must be exactly 10 digits",
      });
    }


    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be 8+ characters with uppercase, lowercase, number & special character",
      });
    }


    const exists =
      await Attendee.findOne({ email }) ||
      await Organizer.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "Email already exists ❌" });
    }


    const hashedPassword = await bcrypt.hash(password, 10);


    if (role === "attendee") {
      await Attendee.create({
        name,
        email,
        phone,
        password: hashedPassword,
      });
    } else {
      await Organizer.create({
  name,
  email,
  phone,
  password: hashedPassword,
  status: "pending"
});


    }

    res.status(201).json({
      message: "Registered successfully 🎉",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error ❌",
    });
  }
});


//login based on roles
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await Attendee.findOne({ email });
    let role = "attendee";

    if (!user) {
      user = await Organizer.findOne({ email });
      role = "organizer";
    }

    if (!user) {
      return res.status(404).json({ message: "User not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password ❌" });
    }
    // 🔴 BLOCK ORGANIZER LOGIN IF NOT APPROVED
if (role === "organizer") {
  if (user.status === "pending") {
    return res.status(403).json({
      message: "Your account is waiting for admin approval"
    });
  }

  if (user.status === "inactive") {
    return res.status(403).json({
      message: "Your account is temporarily blocked by admin"
    });
  }
}



    const token = jwt.sign(
      { id: user._id, role },
      SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful 🎉",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role 
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error ❌" });
  }
});


// =======================AdminLogin=============================

app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      message: "Invalid admin credentials ❌"
    });
  }

  const token = jwt.sign(
    { role: "admin" },
    SECRET_KEY,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Admin login successful ✅",
    token
  });
});




// ✅ GET ALL ORGANISERS (FOR DASHBOARD)
app.get("/admin/organisers/all", adminAuth, async (req, res) => {
  try {
    const organisers = await Organizer.find();
    res.json(organisers);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch organisers" });
  }
});


//pending organiser
app.get("/admin/organisers/pending", adminAuth, async (req, res) => {
  const organisers = await Organizer.find({ status: "pending" });
  res.json(organisers);
});


app.put("/admin/organisers/:id/approve", adminAuth, async (req, res) => {
  const organiser = await Organizer.findById(req.params.id);

  if (!organiser) {
    return res.status(404).json({ message: "Organiser not found" });
  }



  await Organizer.findByIdAndUpdate(
  req.params.id,
  { status: "active" },
  { new: true }
);


  res.json({ message: "Organiser approved" });
});


/* ================= EVENT ROUTES ================= */

app.use("/api/events", eventRoutes);


/* ================= Booking ROUTES ================= */


app.use("/api/bookings", bookingRoutes);

/* ================= Contact us ROUTES ================= */

app.use("/api/contact", contactRoutes);


app.use("/api", organizerRoutes);




app.use("/api/auth", authRoutes);


/* ================= START SERVER ================= */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
