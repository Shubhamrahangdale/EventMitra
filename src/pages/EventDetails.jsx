import { useParams, Link , useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowLeft,
  Heart,
  Share2,
  Ticket,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";



const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);
  


  /* =======================
     FETCH EVENT (LOGIC)
  ======================== */
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
        <main className="pt-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
          <Link to="/events">
            <Button>
              <ArrowLeft className="mr-2" /> Back to Events
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  /* =======================
     DERIVED VALUES
  ======================== */
  const availableTickets = event.totalTickets - event.soldTickets;
  const ticketsPercentage =
    (event.soldTickets / event.totalTickets) * 100;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({ title: "Link copied!" });
  };

  const handleBookTickets = () => {
  if (!user) {
    toast({
      title: "Login Required",
      description: "Please login to book tickets",
      variant: "destructive",
    });

    navigate("/login", {
      state: { from: `/events/${event._id}/book` },
    });
    return;
  }

  navigate(`/events/${event._id}/book`);
};


  

  /* =======================
     UI (UNCHANGED)
  ======================== */
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-20">
        {/* Hero Image */}
        <div className="relative h-[40vh] md:h-[50vh] overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

          {/* Back Button */}
          <div className="absolute top-6 left-6">
            <Button variant="secondary" size="sm" asChild>
              <Link to="/events">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="absolute top-6 right-6 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart
                className={cn(
                  "w-5 h-5",
                  isLiked && "fill-destructive text-destructive"
                )}
              />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="container px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* LEFT */}
            <div className="lg:col-span-2 space-y-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold">
                {event.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  <span>{event.soldTickets} attending</span>
                </div>
              </div>

              <div className="bg-card p-6 rounded-2xl shadow">
                {event.description}
              </div>

              <div className="bg-card p-6 rounded-2xl shadow">
                <h2 className="font-semibold mb-2">Venue</h2>
                <MapPin className="inline mr-2" />
                {event.location}
              </div>

              <div className="bg-card p-6 rounded-2xl shadow">
                <h2 className="font-semibold mb-4">Organizer</h2>
                <div className="space-y-2">
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4" /> {event.organizerId?.name}
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-4 h-4" /> {event.organizerId?.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="w-4 h-4" /> {event.organizerId?.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card p-6 rounded-2xl shadow">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary">
                    {event.price === 0 ? "Free" : `₹${event.price}`}
                  </div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Tickets Sold</span>
                    <span>
                      {event.soldTickets}/{event.totalTickets}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${ticketsPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm mt-2">
                    {availableTickets} tickets remaining
                  </p>
                </div>

               <Button
  size="lg"
  className="w-full"
  onClick={handleBookTickets}
  disabled={availableTickets === 0}
>
  <Ticket className="w-5 h-5 mr-2" />
  {availableTickets === 0 ? "Sold Out" : "Book Tickets"}
</Button>



              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetails;
