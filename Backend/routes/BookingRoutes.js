import express from "express";
import auth from "../middleware/auth.js";
import { createBooking, getMyBookings } from "../controllers/BookingController.js";
import Razorpay from "razorpay";

const router = express.Router();

router.post("/", auth, createBooking);

// BookingRoutes.js
router.get("/my", auth, getMyBookings);


export default router;
