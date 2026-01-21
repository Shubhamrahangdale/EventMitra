import express from "express";
import {
  login,
  sendOtp,
  verifyOtp,
  register,
  registerOtp,
  forgotPassword,
  resetPassword
} from "../controllers/AuthController.js";
import { changePassword } from "../controllers/AuthController.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.post("/registerOtp", registerOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);


export default router;
