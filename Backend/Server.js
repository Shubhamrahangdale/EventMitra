import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import eventRoutes from "./routes/eventRoutes.js";
import bookingRoutes from "./routes/BookingRoutes.js";
import contactRoutes from "./routes/ContactRoutes.js";
import organizerRoutes from "./routes/OrganizerRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import adminSubscriptionRoutes from "./routes/adminSubscriptionRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import profileRoutes from "./routes/profileRoutes.js"; 
import attendeeRoutes from "./routes/attendees.routes.js";
 


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const SECRET_KEY = process.env.SECRET_KEY;



console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED" : "NOT LOADED");


// For DataBase Connection
mongoose.connect(MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch(() => console.log("MongoDB Error ❌"));


/* ================= EVENT ROUTES ================= */

app.use("/admin", adminRoutes);
/* ================= EVENT ROUTES ================= */

app.use("/api/profile", profileRoutes);

/* ================= EVENT ROUTES ================= */

app.use("/api/events", eventRoutes);


/* ================= Booking ROUTES ================= */


app.use("/api/bookings", bookingRoutes);

/* ================= Contact us ROUTES ================= */

app.use("/api/contact", contactRoutes);

/* ================= Organizer ROUTES ================= */

app.use("/api/organizer", organizerRoutes);

/* ================= Auth ROUTES ================= */

app.use("/api/auth", authRoutes);

/* ================= Subscription ROUTES ================= */

app.use("/api/subscriptions", subscriptionRoutes);

/* ================= AdminSubscription ROUTES ================= */

app.use("/api/subscriptions", adminSubscriptionRoutes);

/* ================= PAYMENT ROUTES ================= */

app.use("/api/payment", paymentRoutes);

/* ================= Attendees ROUTES ================= */

app.use("/api/bookings", attendeeRoutes);


/* ================= START SERVER ================= */
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
