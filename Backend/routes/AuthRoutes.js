import express from "express";
import { sendOtp, verifyOtp, register } from "../controllers/AuthController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/register", register);

export default router;
