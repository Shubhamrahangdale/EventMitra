import { useState , useEffect} from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar, MapPin, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

//RazorPay 
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};


//EVENTS
const BookingForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ticketCount, setTicketCount] = useState(1);
  const [attendees, setAttendees] = useState([
    { name: "", age: "", phone: "", gender: "" },
  ]);

useEffect(() => {
  const fetchEvent = async () => {
    try {
      const res = await fetch(`http://localhost:2511/api/events/${id}`);
      if (!res.ok) throw new Error("Event not found");
      const data = await res.json();
      setEvent(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Event not found",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchEvent();
}, [id]);


  if (loading) {
  return <div className="pt-32 text-center">Loading...</div>;
}

if (!event) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Event Not Found</h1>
        <Link to="/events" className="text-primary mt-4 inline-block">
          Back to Events
        </Link>
      </div>
      <Footer />
    </div>
  );
}



  const handleTicketCountChange = (value) => {
    const count = parseInt(value);
    setTicketCount(count);
    
    // Adjust attendees array based on ticket count
    if (count > attendees.length) {
      const newAttendees = [...attendees];
      for (let i = attendees.length; i < count; i++) {
        newAttendees.push({ name: "", age: "", phone: "", gender: "" });
      }
      setAttendees(newAttendees);
    } else if (count < attendees.length) {
      setAttendees(attendees.slice(0, count));
    }
  };

  const handleAttendeeChange = (index, field, value) => {
    const updated = [...attendees];
    updated[index][field] = value;
    setAttendees(updated);
  };
  
const handleSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ Attendee validation
  for (let i = 0; i < attendees.length; i++) {
    const a = attendees[i];

    if (!a.name || !a.age || !a.phone || !a.gender) {
      toast({
        title: "Missing Information",
        description: `Please fill all details for Attendee ${i + 1}`,
        variant: "destructive",
      });
      return;
    }

    if (!/^\d{10}$/.test(a.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: `Attendee ${i + 1} phone number must be exactly 10 digits`,
        variant: "destructive",
      });
      return;
    }
  }

  // 2️⃣ Token check
  const token = localStorage.getItem("token");
  if (!token) {
    toast({
      title: "Login required",
      description: "Please login to continue booking",
      variant: "destructive",
    });
    return;
  }

  // =========================
  // 🆓 FREE EVENT
  // =========================
  if (event.price === 0) {
    const res = await fetch("http://localhost:2511/api/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        eventId: event._id,
        attendees,
        ticketCount,
        totalAmount: 0,
      }),
    });

    const data = await res.json();

    navigate("/booking/confirmation", {
      state: {
        bookingId: data.bookingId,
        event,
        attendees,
        ticketCount,
        totalAmount: 0,
        paymentStatus: "Free",
      },
    });

    return;
  }

  // =========================
  // 💳 PAID EVENT (RAZORPAY)
  // =========================
  const loaded = await loadRazorpay();
  if (!loaded) {
    toast({
      title: "Error",
      description: "Razorpay failed to load",
      variant: "destructive",
    });
    return;
  }

  // Create Razorpay order
  const orderRes = await fetch(
    "http://localhost:2511/api/payment/create-order",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: event.price * ticketCount,
      }),
    }
  );

  const order = await orderRes.json();

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: "INR",
    name: "EventMitra",
    description: event.title,
    order_id: order.id,

    handler: async function (response) {
      // Save booking after payment success
      const bookingRes = await fetch("http://localhost:2511/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          eventId: event._id,
          attendees,
          ticketCount,
          totalAmount: event.price * ticketCount,
          payment: {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
        }),
      });

      const data = await bookingRes.json();

      navigate("/booking/confirmation", {
        state: {
          bookingId: data.bookingId,
          event,
          attendees,
          ticketCount,
          totalAmount: data.totalAmount,

          // 🔥 यही line badge + transaction ID दिखाएगी
          paymentId: response.razorpay_payment_id,
          paymentStatus: "Paid",
        },
      });
    },

    theme: { color: "#ff7a18" },
  };

  const rzp = new window.Razorpay(options);
  rzp.open();
};


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Link
          to={`/events/${id}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Event
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h1 className="text-2xl font-bold text-foreground mb-6">Book Your Tickets</h1>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Number of Tickets */}
                <div className="space-y-2">
                  <Label htmlFor="tickets" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Number of Tickets
                  </Label>
                  <Select
                    value={ticketCount.toString()}
                    onValueChange={handleTicketCountChange}
                  >
                    <SelectTrigger className="w-full max-w-[200px]">
                      <SelectValue placeholder="Select tickets" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "Ticket" : "Tickets"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Attendee Details */}
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-foreground">Attendee Details</h2>
                  
                  {attendees.map((attendee, index) => (
                    <div
                      key={index}
                      className="p-4 bg-muted/30 rounded-lg border border-border space-y-4"
                    >
                      <h3 className="font-medium text-foreground">
                        Attendee {index + 1}
                      </h3>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Full Name</Label>
                          <Input
                            id={`name-${index}`}
                            placeholder="Enter full name"
                            value={attendee.name}
                            onChange={(e) =>
                              handleAttendeeChange(index, "name", e.target.value)
                            }
                            required
                          />
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                          <Label htmlFor={`age-${index}`}>Age</Label>
                          <Input
                            id={`age-${index}`}
                            type="number"
                            placeholder="Enter age"
                            min="1"
                            max="120"
                            value={attendee.age}
                            onChange={(e) =>
                              handleAttendeeChange(index, "age", e.target.value)
                            }
                            required
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-2">
                          <Label htmlFor={`phone-${index}`}>Phone Number</Label>
                           <Input
                            id={`phone-${index}`}
                            type="tel"
                            placeholder="10-digit phone number"
                            value={attendee.phone}
                            maxLength={10}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, ""); 
                              handleAttendeeChange(index, "phone", value);
                            }}
                            required
                          />
                        </div>

                        {/* Gender */}
                        <div className="space-y-2">
                          <Label htmlFor={`gender-${index}`}>Gender</Label>
                          <Select
                            value={attendee.gender}
                            onValueChange={(value) =>
                              handleAttendeeChange(index, "gender", value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <Button type="submit" size="lg" className="w-full">
                  Proceed to Payment
                </Button>
              </form>
            </div>
          </div>

          {/* Event Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-foreground mb-4">Event Summary</h2>
              
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              
              <h3 className="font-semibold text-foreground mb-3">{event.title}</h3>
              
              <div className="space-y-2 text-sm text-muted-foreground mb-6">
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

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Price per ticket</span>
                  <span className="text-foreground">
                    {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity</span>
                  <span className="text-foreground">{ticketCount}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">
                    {event.price === 0 ? "Free" : `₹${(event.price * ticketCount).toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BookingForm;