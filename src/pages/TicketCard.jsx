import { QRCodeSVG } from "qrcode.react";
import { Calendar, Clock, MapPin, User } from "lucide-react";

export const TicketCard = ({ bookingId, event, attendees, payment }) => {
  return (
    <div className="w-full max-w-2xl mx-auto bg-card rounded-lg shadow-card overflow-hidden">

      {/* Booking Header */}
      <div className="px-6 py-4 flex justify-between items-center border-b border-border">
        <span className="text-sm text-muted-foreground font-medium">
          Booking ID
        </span>
        <span className="text-sm font-semibold text-primary">
          {bookingId}
        </span>
      </div>

      {/* Event Details */}
      <div className="px-6 py-5 border-b border-border">
        <div className="flex gap-4">
          <img
            src={event.imageUrl}
            alt={event.name}
            className="w-20 h-20 rounded-lg object-cover shadow-sm"
          />
          <div>
            <h3 className="font-semibold text-lg">{event.name}</h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {event.date}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {event.time}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              {event.venue}
            </div>
          </div>
        </div>
      </div>

      {/* Attendees */}
      <div className="px-6 py-5 border-b border-border">
        <h4 className="font-semibold mb-4">Attendee Details</h4>

        {attendees.map((a, i) => {
          const qrData = JSON.stringify({
            bookingId,
            ticketNumber: a.ticketNumber,
            name: a.name,
            event: event.name,
            date: event.date,
            time: event.time,
            venue: event.venue,
          });

          return (
            <div
              key={i}
              className="ticket-bg rounded-lg p-4 mb-3 border border-border"
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>

                  <div>
                    <div className="flex gap-2 items-center">
                      <span className="font-semibold">{a.name}</span>
                      <span className="text-xs bg-primary text-white px-2 rounded-full">
                        Ticket {a.ticketNumber}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Age: {a.age}
                    </span>
                  </div>
                </div>

                {/* QR Code */}
                <QRCodeSVG value={qrData} size={90} />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border text-sm">
                <div>
                  <p className="text-muted-foreground">Gender</p>
                  {a.gender}
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  {a.phone}
                </div>
                <div>
                  <p className="text-muted-foreground">Event</p>
                  {event.name}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment */}
      <div className="px-6 py-5">
        <h4 className="font-semibold mb-3">Payment Summary</h4>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Price per ticket</span>
            ₹{payment.pricePerTicket}
          </div>
          <div className="flex justify-between">
            <span>Number of tickets</span>
            {payment.numberOfTickets}
          </div>
          <div className="flex justify-between font-bold text-primary text-lg pt-3 border-t">
            <span>Total Paid</span>
            ₹{payment.totalPaid}
          </div>
        </div>
      </div>

    </div>
  );
};
