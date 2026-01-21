import Razorpay from "razorpay";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Razorpay keys missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.trim(),
  key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
});

console.log("RZP ID:", process.env.RAZORPAY_KEY_ID);
console.log("RZP SECRET:", process.env.RAZORPAY_KEY_SECRET ? "LOADED" : "MISSING");


export default razorpay;
