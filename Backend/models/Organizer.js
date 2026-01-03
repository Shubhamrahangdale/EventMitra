import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,

  status: {
    type: String,
    enum: ["pending", "active", "inactive"],
    default: "pending",
  },

  subscription: {
    plan: {
      type: String,
      enum: ["basic", "pro", "enterprise"],
      default: "basic",
    },
    status: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },
    amount: {
      type: Number,
      default: 0,
    },
    eventsAllowed: {
      type: Number,
      default: 0,
    },
    eventsUsed: {
      type: Number,
      default: 0,
    },
    startDate: Date,
    endDate: Date,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Organizer = mongoose.model("Organizer", organizerSchema);
export default Organizer;
