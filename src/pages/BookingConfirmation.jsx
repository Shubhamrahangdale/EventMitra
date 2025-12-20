import { useLocation, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";


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

  // Redirect if no booking data
  if (!bookingData) {
    return <Navigate to="/events" replace />;
  }

  const { event, attendees, ticketCount, totalAmount, bookingId } = bookingData;

  // Download the tickets
  const downloadTickets = async () => {
    for (let i = 0; i < attendees.length; i++) {
      const attendee = attendees[i];

      const ticketElement = document.getElementById(`ticket-${i}`);
      const canvas = await html2canvas(ticketElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      pdf.addImage(imgData, "PNG", 10, 10, 190, 250);

      // Watermark
      pdf.setTextColor(200);
      pdf.setFontSize(30);
      pdf.text("EventMitra Official Ticket", 20, 160, {
        angle: 45,
      });

      pdf.save(`${attendee.name}-Ticket.pdf`);
    }
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
            <div className="mb-4">
              <h3 className="font-semibold text-foreground mb-3">
                Attendee Details
              </h3>
              <div className="space-y-3">
                {attendees.map((attendee, index) => (

                  <div
                    key={index}
                    id={`ticket-${index}`}
                    className="bg-white text-black rounded-2xl border border-gray-200 p-6 mb-6 shadow-sm"
                    style={{ width: "100%" }}
                  >
                    {/* TOP ROW */}
                    <div className="flex justify-between items-start">
                      {/* LEFT */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-orange-600" />
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-semibold text-lg">{attendee.name}</h2>
                            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                              Ticket {index + 1}
                            </span>
                          </div>

                          <p className="text-sm text-gray-600 mt-1">
                            Age: {attendee.age}
                          </p>
                        </div>
                      </div>

                      {/* QR CODE */}
                      <div className="bg-white p-2 border rounded-lg">
                        <QRCodeCanvas
                          value={`${bookingId}-${attendee.name}`}
                          size={90}
                        />

                      </div>
                    </div>

                    {/* DETAILS ROW */}
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mt-4">
                      <div>
                        <p className="font-medium">Gender</p>
                        <p className="capitalize">{attendee.gender}</p>
                      </div>

                      <div>
                        <p className="font-medium">Phone</p>
                        <p>{attendee.phone}</p>
                      </div>

                      <div>
                        <p className="font-medium">Event</p>
                        <p className="truncate">{event.title}</p>
                      </div>
                    </div>

                    {/* WATERMARK (VISIBLE IN PDF) */}
                    {/* <div className="relative mt-6">
                      <p
                        className="absolute inset-0 flex items-center justify-center text-gray-300 text-xl font-semibold rotate-[-35deg]"
                        style={{ pointerEvents: "none" }}
                      >
                        EventMitra Official Ticket
                      </p>
                    </div> */}
                  </div>

                ))}
              </div>
            </div>

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

      <Footer />
    </div>
  );
};

export default BookingConfirmation;
