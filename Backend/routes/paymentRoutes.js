import express from "express";
import Razorpay from "razorpay";

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const order = await razorpay.orders.create({
      amount: amount * 100, // rupees → paisa
      currency: "INR",
      receipt: "event_" + Date.now(),
    });

    res.json(order);
  } catch (error) {
    console.error("RAZORPAY ERROR:", error);
    res.status(500).json({ message: "Payment order creation failed" });
  }
});

export default router;
