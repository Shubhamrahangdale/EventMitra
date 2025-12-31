// import PDFDocument from "pdfkit";
// import fs from "fs";
// import path from "path";

// export const generateTicketPDF = (booking) => {
//   return new Promise((resolve) => {
//     const doc = new PDFDocument({ size: "A4", margin: 50 });

//     const dir = path.join(process.cwd(), "tickets");
//     fs.mkdirSync(dir, { recursive: true });

//     const filePath = path.join(
//       dir,
//       `ticket-${booking.bookingId}.pdf`
//     );

//     const stream = fs.createWriteStream(filePath);
//     doc.pipe(stream);

//     doc
//       .fontSize(22)
//       .text("🎫 EventMitra - Event Ticket", { align: "center" })
//       .moveDown();

//     doc.fontSize(14);
//     doc.text(`Ticket ID: ${booking.bookingId}`);
//     doc.text(`Name: ${booking.userName}`);
//     doc.text(`Email: ${booking.email}`);
//     doc.text(`Event: ${booking.eventTitle}`);
//     doc.text(`Date: ${booking.eventDate}`);
//     doc.text(`Location: ${booking.location}`);
//     doc.text(`Seats: ${booking.ticketCount}`);
//     doc.text(`Amount Paid: ₹${booking.totalAmount}`);
//     doc.moveDown();

//     doc.text("Attendees:");
//     booking.attendees.forEach((a, i) => {
//       doc.text(`${i + 1}. ${a.name} - ${a.phone}`);
//     });

//     doc.moveDown();
//     doc.fontSize(12).text(
//       "Please carry this ticket (digital or printed) at the event entry."
//     );

//     doc.end();

//     stream.on("finish", () => resolve(filePath));
//   });
// };
