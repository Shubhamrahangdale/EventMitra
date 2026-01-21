import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/Subscription.js";
import Organizer from "../models/Organizer.js";

let razorpay;

/* ================================
   🔐 Razorpay Initialization
================================ */
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.error("❌ Razorpay keys missing in .env");
}

/* ================================
   🧾 CREATE ORDER
================================ */
export const createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res
        .status(500)
        .json({ message: "Payment service not configured" });
    }

    const { planId } = req.body;

    const plans = {
      basic: 4999,
      pro: 9999,
      enterprise: 19999,
    };

    if (!plans[planId]) {
      return res.status(400).json({ message: "Invalid plan" });
    }

    const order = await razorpay.orders.create({
      amount: plans[planId] * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    return res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      plan: planId,
    });
  } catch (err) {
    console.error("RAZORPAY FULL ERROR:", err?.error || err?.response || err);
  res.status(500).json({
    message: "Order creation failed",
    razorpay: err?.error || err?.message,
  });
  }
};

/* ================================
   ✅ VERIFY PAYMENT
================================ */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    /* 🔐 Signature Verification */
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    /* 💰 Amount & Event Limits */
    const amount =
      plan === "basic" ? 4999 :
      plan === "pro" ? 9999 :
      19999;

    const eventsAllowed =
      plan === "basic" ? 5 :
      plan === "pro" ? 20 :
      999;

    /* 🧾 Save Subscription History (Admin / Audit) */
    const subscription = await Subscription.create({
      organizerId: req.user.id,
      plan,
      amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "success",
      expiryDate: new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      ),
    });

    /* 🚀 ACTIVATE ORGANIZER (MAIN LOGIC) */
    await Organizer.findByIdAndUpdate(req.user.id, {
      status: "active",
      subscription: {
        plan,
        status: "active",
        amount,
        eventsAllowed,
        eventsUsed: 0,
        startDate: new Date(),
        endDate: subscription.expiryDate,
      },
    });

    return res.json({
      message: "Subscription activated successfully 🎉",
      subscription,
    });
  } catch (err) {
    console.error("PAYMENT VERIFY ERROR:", err);
    res.status(500).json({ message: "Payment verification failed" });
  }
};

/* ================================
   🛡️ ADMIN: GET ALL SUBSCRIPTIONS
================================ */
export const getAllSubscriptions = async (req, res) => {
  try {
    const subs = await Subscription.find()
      .populate("organizerId", "name email status");

    res.json(subs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subscriptions" });
  }
};
