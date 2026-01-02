import express from "express";
import {
  createOrder,
  verifyPayment,
  getAllSubscriptions,
} from "../controllers/subscriptionController.js";

import auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Organizer
router.post("/create-order", auth, createOrder);
router.post("/verify", auth, verifyPayment);

// Admin
router.get("/admin/all", adminAuth, getAllSubscriptions);


export default router;
