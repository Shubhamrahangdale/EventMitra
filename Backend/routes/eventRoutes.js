import express from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import checkSubscription from "../middleware/checkSubscription.js";

import {
  createEvent,
  getOrganizerEvents,
  getAllEvents,
  singleEvent,
  deleteEvent,
  publishEvent,
  editEvent,
  eventToAdmin,
  eventToApprove,
  eventToReject,
  getAllAdminEvents,
} from "../controllers/eventController.js";

const router = express.Router();

// Organizer routes
router.post("/", auth, checkSubscription, createEvent);
router.get("/organizer/:id", auth, getOrganizerEvents);

// Public routes
router.get("/", getAllEvents);
router.get("/:id", singleEvent);

// Organizer management
router.delete("/:id", auth, deleteEvent);
router.patch("/:id/status", auth, publishEvent);
router.put("/:id", auth, editEvent);

// Admin routes
router.get("/admin/events/pending", adminAuth, eventToAdmin);
router.put("/admin/events/:id/approve", adminAuth, eventToApprove);
router.put("/admin/events/:id/reject", adminAuth, eventToReject);
router.get("/admin/events/all", adminAuth, getAllAdminEvents);

export default router;
