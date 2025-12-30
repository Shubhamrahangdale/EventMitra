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

const router = express.Router();

router.post("/", auth, createEvent);

router.get("/organizer/:id", auth, getOrganizerEvents);
router.get("/", getAllEvents);
router.get("/:id", singleEvent);
router.delete("/:id", deleteEvent);
router.patch("/:id/status", publishEvent);
router.put("/:id", editEvent);


// ✅ ADMIN ROUTES
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
