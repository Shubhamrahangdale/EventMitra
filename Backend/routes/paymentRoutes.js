// import express from "express";
// import razorpay from "../services/razorpay.js";


// const router = express.Router();


// router.post("/create-order", async (req, res) => {
//   try {
//     const { amount } = req.body;

//     if (!amount) {
//       return res.status(400).json({ message: "Amount is required" });
//     }

//     const order = await razorpay.orders.create({
//       amount: amount * 100, // rupees → paisa
//       currency: "INR",
//       receipt: "event_" + Date.now(),
//     });

//     res.json(order);
//   } catch (error) {
//     console.error("RAZORPAY ERROR:", error);
//     res.status(500).json({ message: "Payment order creation failed" });
//   }
// });

// export default router;


import express from "express";

const router = express.Router();

/*
  This route is kept only for health checking.
  All Razorpay logic is now handled via:
  /api/subscriptions/create-order
  /api/subscriptions/verify
*/

router.get("/health", (req, res) => {
  res.json({ status: "payment route ok" });
});

export default router;
