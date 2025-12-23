import Booking from "../models/Booking.js";
import PDFDocument from "pdfkit";
import Event from "../models/Event.js";

export const createBooking = async (req, res) => {
  try {
    const { eventId, attendees, ticketCount, totalAmount } = req.body;

    //  Fetch event to get title + organizer

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
    const userId = req.user.id;
    const bookings = await Booking.find({ userId: req.user.id })
      .populate("eventId");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

//for view ticket after booking from my ticket 


export const getBookingPDF = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    res.setHeader("Content-Type", "application/pdf");
res.setHeader(
  "Content-Disposition",
  `attachment; filename="${booking.bookingId}.pdf"`
);

res.send(pdfBuffer);


  

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(20).text("🎟 EventMitra Ticket", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Event: ${booking.eventTitle}`);
    doc.text(`Booking ID: ${booking.bookingId}`);
    doc.text(`Tickets: ${booking.ticketCount}`);
    doc.text(`Status: ${booking.status}`);
    doc.moveDown();

    booking.attendees.forEach((a, i) => {
      doc.text(`Attendee ${i + 1}: ${a.name} (${a.phone})`);
    });

    doc.end();
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate PDF");
  }
};

