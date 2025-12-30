import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
    findOrganizer,
  subscription
} from "../controllers/OrganizerController.js";

const router = express.Router();


router.put("/admin/organisers/:id/subscription", adminAuth, subscription);
router.get("/admin/organisers/all", adminAuth, findOrganizer);

export default router;