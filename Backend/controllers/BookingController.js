import Booking from "../models/Booking.js";
import Event from "../models/Event.js";


export const createBooking = async (req, res) => {
  try {
    const {
      eventId,
      attendees,
      ticketCount,
      totalAmount,
      payment, 
    } = req.body;

    // 🔹 Phone validation (keep as-is)
    for (let i = 0; i < attendees.length; i++) {
      if (!/^\d{10}$/.test(attendees[i].phone)) {
        return res.status(400).json({
          message: `Invalid phone number for attendee ${i + 1}`,
        });
      }
    }

    // 🔹 Validate Event
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // 🔹 PAID EVENTS REQUIRE PAYMENT
    if (event.price > 0) {
      if (!payment || !payment.razorpayPaymentId) {
        return res.status(400).json({
          message: "Payment not completed",
        });
      }
    }

    // ✅ CREATE BOOKING
    const booking = await Booking.create({
      bookingId: `BK${Date.now()}`,
      eventId: event._id,
      eventTitle: event.title,
      userId: req.user.id,
      attendees,
      ticketCount,
      totalAmount,

      payment: event.price > 0 ? payment : null,
      paymentStatus: event.price > 0 ? "paid" : "paid",
    });

    // 🔹 Update sold tickets
    event.soldTickets += ticketCount;
    await event.save();

    res.status(201).json({
      bookingId: booking.bookingId,
      totalAmount: booking.totalAmount,
      booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Booking failed" });
  }
};


export const getMyBookings = async (req, res) => {
  try {
   const bookings = await Booking.find({ userId: req.user.id })
    .populate("eventId");

  res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

