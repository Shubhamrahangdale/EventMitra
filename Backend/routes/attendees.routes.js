import express from "express";
import auth from "../middleware/auth.js";
import { getAttendeesByEvent } from "../controllers/attendeeController.js";

const router = express.Router();

// GET all attendees for one event
router.get("/event/:eventId", auth, getAttendeesByEvent);

export default router;
