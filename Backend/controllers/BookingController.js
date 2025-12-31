import Booking from "../models/Booking.js";
import Event from "../models/Event.js";


export const createBooking = async (req, res) => {
  try {
    const { eventId, attendees, ticketCount, totalAmount } = req.body;

    for (let i = 0; i < attendees.length; i++) {
      const phone = attendees[i].phone;

      if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({
          message: `Invalid phone number for attendee ${i + 1}. Must be 10 digits.`,
        });
      }
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const booking = await Booking.create({
      bookingId: `BK${Date.now()}`,
      eventId: event._id,
      eventTitle: event.title,
      organizerId: event.organizerId,
      userId: req.user.id,
      attendees,
      ticketCount,
      totalAmount,
    });

    //  Update sold tickets
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

