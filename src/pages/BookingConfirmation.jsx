import { useLocation, Link, Navigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { TicketCard } from "@/pages/TicketCard";

import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Download,
  Home
} from "lucide-react";

const BookingConfirmation = () => {
  const location = useLocation();
  const bookingData = location.state;
  const [renderForPDF, setRenderForPDF] = useState(false);



  // Redirect if no booking data
  if (!bookingData) {
    return <Navigate to="/events" replace />;
  }

 const { event, attendees, ticketCount, totalAmount, bookingId } = bookingData;
 const [showTicket, setShowTicket] = useState(false);

//for split into page 
const chunkArray = (arr, size) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
};

  // Download the tickets
// const downloadTickets = async () => {
//   const pdf = new jsPDF("p", "mm", "a4");

//   const pages = chunkArray(attendees, 5); // 👈 5 tickets per page

//   setRenderForPDF(true);

//   setTimeout(async () => {
//     for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
//       const element = document.getElementById(`ticket-page-${pageIndex}`);
//       if (!element) continue;

//       const canvas = await html2canvas(element, {
//         scale: 2,
//         useCORS: true,
//         backgroundColor: "#ffffff",
//       });

//       const imgData = canvas.toDataURL("image/png");
//       const imgWidth = 190;
//       const imgHeight = (canvas.height * imgWidth) / canvas.width;

//       if (pageIndex !== 0) pdf.addPage();

//       pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
//     }

//     pdf.save(`${bookingId}.pdf`);
//     setRenderForPDF(false);
//   }, 400);
// };
const downloadTickets = async () => {
  const html = document.documentElement;
  const wasDark = html.classList.contains("dark");
  html.classList.remove("dark"); // force light mode for PDF

  const pdf = new jsPDF("p", "mm", "a4");
  const pages = chunkArray(attendees, 5); // 5 tickets per page

  setRenderForPDF(true);

  // wait for hidden DOM to render
  setTimeout(async () => {
    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      const pageElement = document.getElementById(
        `ticket-page-${pageIndex}`
      );

      if (!pageElement) {
        console.error("Missing page:", pageIndex);
        continue;
      }

      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (pageIndex !== 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    }

    pdf.save(`${bookingId}.pdf`);

    setRenderForPDF(false);
    if (wasDark) html.classList.add("dark");
  }, 400);
};



// Ticket Card Data 
  const ticketCardData = {
  bookingId,
  event: {
    name: event.title,
    date: event.date,
    time: event.time,
    venue: `${event.location}, ${event.city}`,
    imageUrl: event.image,
  },
  attendees: attendees.map((a, i) => ({
    name: a.name,
    age: a.age,
    gender: a.gender,
    phone: a.phone,
    ticketNumber: i + 1,
  })),
  payment: {
    pricePerTicket: event.price,
    numberOfTickets: ticketCount,
    totalPaid: totalAmount,
  },
};


  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your tickets have been successfully booked.
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm mb-6">
            {/* Booking ID */}
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <span className="text-sm text-muted-foreground">Booking ID</span>
              <span className="font-mono font-semibold text-foreground">
                {bookingId}
              </span>
            </div>

            {/* Event Info */}
            <div className="flex gap-4 pb-4 border-b border-border mb-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-foreground mb-2">
                  {event.title}
                </h2>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}, {event.city}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Attendee Details */}
           

            {/* Payment Summary */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-foreground mb-3">
                Payment Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per ticket</span>
                  <span className="text-foreground">
                    {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Number of tickets</span>
                  <span className="text-foreground">{ticketCount}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span className="text-foreground">Total Paid</span>
                  <span className="text-primary">
                    {totalAmount === 0 ? "Free" : `₹${totalAmount.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              A confirmation email with your tickets has been sent to your registered email address.
              Please carry a valid ID proof matching the attendee names when attending the event.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
<Button className="flex-1" onClick={downloadTickets}>
  <Download className="h-4 w-4 mr-2" />
  Download Tickets
</Button>

           
          </div>
        </div>
      </main>
      {/* Hidden TicketCard for PDF generation only */}
{renderForPDF &&
  chunkArray(attendees, 5).map((pageAttendees, index) => (
    <div
      key={index}
      id={`ticket-page-${index}`}
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "800px",
      }}
    >
      <TicketCard
        bookingId={bookingId}
        event={{
          name: event.title,
          date: event.date,
          time: event.time,
          venue: `${event.location}, ${event.city}`,
          imageUrl: event.image,
        }}
        attendees={pageAttendees.map((a, i) => ({
          name: a.name,
          age: a.age,
          gender: a.gender,
          phone: a.phone,
          ticketNumber: index * 5 + i + 1, 
        }))}
        payment={{
          pricePerTicket: event.price,
          numberOfTickets: ticketCount,
          totalPaid: totalAmount,
        }}
      />
    </div>
  ))}

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
