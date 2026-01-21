import mongoose from "mongoose";
import Booking from "../models/Booking.js";

export const getAttendeesByEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: "Invalid event id" });
    }

    // Find all bookings for this event
    const bookings = await Booking.find({
      eventId: new mongoose.Types.ObjectId(eventId),
    })
      .populate("userId", "name email phone")
      .lean();

    if (!bookings.length) {
      return res.json([]);
    }

    // Extract attendee list
    const attendees = bookings.flatMap((b) =>
      (b.attendees || []).map((a) => ({
        name: a.name,
        phone: a.phone,
        gender: a.gender,
        age: a.age,
        email: b.userId?.email || "N/A",
        quantity: b.ticketCount,
      }))
    );

    res.json(attendees);
  } catch (err) {
    console.error("❌ Attendee error:", err);
    res.status(500).json({ message: "Failed to fetch attendees" });
  }
};
