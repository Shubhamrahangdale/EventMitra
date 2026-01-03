import express from "express";
import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getMe,
  findOrganizer,
  pendingOrganizer,
  subscription,
} from "../controllers/OrganizerController.js";

const router = express.Router();

/* =========================
   ORGANIZER ROUTES
========================= */
router.get("/me", auth, getMe);

/* =========================
   ADMIN ROUTES
========================= */
router.put("/admin/organisers/:id/subscription", adminAuth, subscription);
router.get("/admin/organisers/all", adminAuth, findOrganizer);
router.get("/admin/organisers/pending", adminAuth, pendingOrganizer);

export default router;
