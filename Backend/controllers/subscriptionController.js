import dotenv from "dotenv";
dotenv.config();
import Razorpay from "razorpay";
import crypto from "crypto";
import Subscription from "../models/Subscription.js";
import Organizer from "../models/Organizer.js";

let razorpay;

//  SAFE Razorpay initialization
if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_SECRET
) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
} else {
  console.error("❌ Razorpay keys missing in .env");
}

// Create Order
export const createOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(500).json({
        message: "Payment service not configured",
      });
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
      receipt: `rcpt_${Date.now()}`,
    });

    res.json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      plan: planId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Order creation failed" });
  }
};

// Verify Payment 

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      plan,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const amount =
      plan === "basic" ? 4999 :
      plan === "pro" ? 9999 : 19999;

    // Save Subcription as active
    
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

// Activate Organiser Immedietly
await Organizer.findByIdAndUpdate(req.user.id, {
  status: "active",
  subscription: {
    plan,
    status: "active",
    amount,
    expiryDate: subscription.expiryDate,
    eventsAllowed:
      plan === "basic" ? 5 :
      plan === "pro" ? 20 : 999,
  },
});
    res.json({
      message: "Subscription activated successfully",
      subscription,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Verification failed" });
  }
};

// Admin Get-All
export const getAllSubscriptions = async (req, res) => {
  const subs = await Subscription.find()
    .populate("organizerId", "name email status");
  res.json(subs);
};


