import express from "express";
import {
  getAllSubscriptions,
} from "../controllers/subscriptionController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Admin routes
router.get("/admin/all", adminAuth, getAllSubscriptions);

export default router;
