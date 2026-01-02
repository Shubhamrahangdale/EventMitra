import express from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
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
  getAllAdminEvents
} from "../controllers/eventController.js";

import checkSubscription from "../middleware/checkSubscription.js";

const router = express.Router();


router.post("/", auth, checkSubscription, createEvent);


router.get("/organizer/:id", auth, getOrganizerEvents);
router.get("/", getAllEvents);
router.get("/:id", singleEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id/status", publishEvent);
router.put("/:id", editEvent);


// Admin Routes
router.get("/admin/events/pending", adminAuth, eventToAdmin);
router.put("/admin/events/:id/approve", adminAuth, eventToApprove);
router.put(
  "/admin/events/:id/reject",
  adminAuth,
  eventToReject
);
router.get(
  "/admin/events/all",
  adminAuth,    
  getAllAdminEvents
);




export default router;
