import express from "express";
import auth from "../middleware/auth.js";
import { createBooking } from "../controllers/BookingController.js";

const router = express.Router();

router.post("/", auth, createBooking);

export default router;
