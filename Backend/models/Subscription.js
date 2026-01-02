import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },

    plan: {
      type: String,
      enum: ["basic", "pro", "enterprise"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,

    status: {
      type: String,
      default: "success",
    },

    expiryDate: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Subscription", subscriptionSchema);
