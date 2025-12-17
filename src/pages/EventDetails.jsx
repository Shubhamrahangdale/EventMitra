import { useParams, Link } from "react-router-dom";
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
  Phone
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const allEvents = [
  {
    id: 1,
    title: "Bangalore Tech Summit 2025",
    category: "Conference",
    date: "Jan 15, 2025",
    endDate: "Jan 17, 2025",
    time: "9:00 AM",
    endTime: "6:00 PM",
    location: "Bangalore International Exhibition Centre",
    address: "10th Mile, Tumkur Road, Madavara Post, Dasanapura Hobli, Bangalore 562123",
    city: "Bangalore",
    attendees: 2500,
    totalCapacity: 3000,
    price: 2999,
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200",
    description: "India's largest technology conference featuring industry leaders and innovators. Join us for three days of inspiring talks, hands-on workshops, and networking opportunities with the brightest minds in tech.",
    highlights: [
      "50+ Industry Expert Speakers",
      "Hands-on Technical Workshops",
      "Startup Pitch Competition",
      "Career Fair with Top Companies",
      "Networking Sessions"
    ],
    organizer: {
      name: "TechIndia Events",
      email: "info@techindia.com",
      phone: "+91 80 4567 8900"
    }
  },
  {
    id: 2,
    title: "Diwali Cultural Night",
    category: "Festival",
    date: "Nov 12, 2025",
    endDate: null,
    time: "6:00 PM",
    endTime: "11:00 PM",
    location: "Gateway of India Grounds",
    address: "Apollo Bandar, Colaba, Mumbai 400001",
    city: "Mumbai",
    attendees: 5000,
    totalCapacity: 6000,
    price: 499,
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200",
    description: "Celebrate the festival of lights with a grand cultural evening featuring traditional music, dance performances, and a spectacular fireworks display. Experience the magic of Diwali with family and friends.",
    highlights: [
      "Traditional Dance Performances",
      "Live Music by Renowned Artists",
      "Grand Fireworks Display",
      "Food Stalls with Festive Delicacies",
      "Rangoli Competition"
    ],
    organizer: {
      name: "Mumbai Cultural Trust",
      email: "events@mumbaitrust.org",
      phone: "+91 22 2345 6789"
    }
  },
  {
    id: 3,
    title: "Wedding Expo 2025",
    category: "Exhibition",
    date: "Feb 20, 2025",
    endDate: "Feb 23, 2025",
    time: "10:00 AM",
    endTime: "8:00 PM",
    location: "Pragati Maidan",
    address: "Mathura Road, New Delhi 110001",
    city: "Delhi",
    attendees: 3000,
    totalCapacity: 5000,
    price: 0,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200",
    description: "Discover the latest wedding trends, meet top vendors, and get inspired for your special day. From bridal fashion to wedding planners, find everything you need under one roof.",
    highlights: [
      "200+ Wedding Vendors",
      "Bridal Fashion Shows",
      "Live Cake Decorating Demos",
      "Photography Exhibitions",
      "Free Wedding Consultations"
    ],
    organizer: {
      name: "WeddingBazaar India",
      email: "hello@weddingbazaar.in",
      phone: "+91 11 9876 5432"
    }
  },
  {
    id: 4,
    title: "Startup Pitch Night",
    category: "Networking",
    date: "Dec 28, 2024",
    endDate: null,
    time: "5:00 PM",
    endTime: "9:00 PM",
    location: "T-Hub",
    address: "Plot No 1/C, Sy No 83/1, Raidurgam Panmaktha, Knowledge City, Hyderabad 500081",
    city: "Hyderabad",
    attendees: 500,
    totalCapacity: 600,
    price: 1499,
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200",
    description: "Watch promising startups pitch their ideas to a panel of investors. Network with entrepreneurs, venture capitalists, and industry mentors in an exciting evening of innovation.",
    highlights: [
      "10 Startup Pitches",
      "Investor Panel Q&A",
      "Networking Dinner",
      "Mentorship Sessions",
      "Prize Pool of ₹10 Lakhs"
    ],
    organizer: {
      name: "T-Hub Foundation",
      email: "events@t-hub.co",
      phone: "+91 40 6789 0123"
    }
  },
  {
    id: 5,
    title: "Classical Music Festival",
    category: "Concert",
    date: "Jan 5, 2025",
    endDate: "Jan 7, 2025",
    time: "7:00 PM",
    endTime: "10:00 PM",
    location: "Music Academy",
    address: "306, TTK Road, Royapettah, Chennai 600014",
    city: "Chennai",
    attendees: 1500,
    totalCapacity: 2000,
    price: 799,
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200",
    description: "An evening of soulful carnatic and hindustani classical performances by maestros from across India. Experience the divine magic of Indian classical music.",
    highlights: [
      "Performances by Padma Awardees",
      "Jugalbandi Sessions",
      "Young Talent Showcase",
      "Interactive Music Workshops",
      "Meet & Greet with Artists"
    ],
    organizer: {
      name: "Chennai Music Academy",
      email: "info@musicacademy.in",
      phone: "+91 44 2345 6789"
    }
  },
  {
    id: 6,
    title: "Yoga & Wellness Retreat",
    category: "Workshop",
    date: "Mar 10, 2025",
    endDate: "Mar 12, 2025",
    time: "6:00 AM",
    endTime: "8:00 PM",
    location: "Parmarth Niketan Ashram",
    address: "Swargashram, Rishikesh, Uttarakhand 249304",
    city: "Rishikesh",
    attendees: 200,
    totalCapacity: 250,
    price: 5999,
    image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=1200",
    description: "A transformative 3-day wellness retreat by the Ganges. Experience yoga, meditation, ayurvedic treatments, and spiritual healing in the yoga capital of the world.",
    highlights: [
      "Daily Yoga & Meditation Sessions",
      "Ayurvedic Spa Treatments",
      "Ganga Aarti Experience",
      "Organic Sattvic Meals",
      "Nature Treks & Excursions"
    ],
    organizer: {
      name: "Parmarth Niketan",
      email: "retreat@parmarth.org",
      phone: "+91 135 244 0088"
    }
  },
  {
    id: 7,
    title: "Food & Wine Festival",
    category: "Festival",
    date: "Feb 14, 2025",
    endDate: "Feb 16, 2025",
    time: "12:00 PM",
    endTime: "10:00 PM",
    location: "Sula Vineyards",
    address: "Sula Vineyards, Gat 36/2, Govardhan Village, Nashik 422222",
    city: "Nashik",
    attendees: 2000,
    totalCapacity: 2500,
    price: 1999,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200",
    description: "Sample premium wines and gourmet food from top chefs at India's most scenic vineyard. A weekend of culinary delights, live music, and vineyard tours.",
    highlights: [
      "Wine Tasting Sessions",
      "Gourmet Food Stalls",
      "Live Music & DJ Nights",
      "Vineyard Tours",
      "Cooking Masterclasses"
    ],
    organizer: {
      name: "Sula Vineyards",
      email: "events@sulawines.com",
      phone: "+91 253 230 1234"
    }
  },
  {
    id: 8,
    title: "Photography Masterclass",
    category: "Workshop",
    date: "Jan 25, 2025",
    endDate: "Jan 26, 2025",
    time: "10:00 AM",
    endTime: "5:00 PM",
    location: "India Habitat Centre",
    address: "Lodhi Road, New Delhi 110003",
    city: "Delhi",
    attendees: 100,
    totalCapacity: 120,
    price: 3499,
    image: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=1200",
    description: "Learn from award-winning photographers in this intensive 2-day workshop. Master composition, lighting, and post-processing techniques.",
    highlights: [
      "Hands-on Practical Sessions",
      "Portrait & Landscape Photography",
      "Photo Editing Workshop",
      "Equipment Guidance",
      "Certificate of Completion"
    ],
    organizer: {
      name: "PhotoSchool India",
      email: "learn@photoschool.in",
      phone: "+91 11 4567 8901"
    }
  },
];

const EventDetails = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [ticketCount, setTicketCount] = useState(1);

  const event = allEvents.find(e => e.id === parseInt(id));

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-20">
          <div className="container px-4">
            <div className="text-center py-20">
              <h1 className="font-display text-3xl font-bold text-foreground mb-4">
                Event Not Found
              </h1>
              <p className="text-muted-foreground mb-8">
                The event you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to="/events">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Events
                </Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const availableTickets = event.totalCapacity - event.attendees;
  const ticketsPercentage = (event.attendees / event.totalCapacity) * 100;

  const handleBookTickets = () => {
    toast({
      title: "Error",
      description: `Booking ${ticketCount} ticket(s) for ${event.title}`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied!",
      description: "Event link has been copied to clipboard.",
    });
  };

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
              <Heart className={cn("w-5 h-5", isLiked && "fill-destructive text-destructive")} />
            </Button>
            <Button variant="secondary" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5" />
            </Button>
          </div>

          {/* Category Badge */}
          <div className="absolute bottom-6 left-6">
            <span className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-medium">
              {event.category}
            </span>
          </div>
        </div>

        <div className="container px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title & Basic Info */}
              <div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                  {event.title}
                </h1>
                
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span>{event.date}{event.endDate && ` - ${event.endDate}`}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{event.time} - {event.endTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    <span>{event.attendees.toLocaleString()} attending</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card p-6 rounded-2xl shadow-elegant">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  About This Event
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Highlights */}
              <div className="bg-card p-6 rounded-2xl shadow-elegant">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Event Highlights
                </h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {event.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-muted-foreground">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Location */}
              <div className="bg-card p-6 rounded-2xl shadow-elegant">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Venue
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{event.location}</h3>
                    <p className="text-muted-foreground">{event.address}</p>
                  </div>
                </div>
              </div>

              {/* Organizer */}
              <div className="bg-card p-6 rounded-2xl shadow-elegant">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">
                  Organizer
                </h2>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground">{event.organizer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{event.organizer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{event.organizer.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-card p-6 rounded-2xl shadow-elegant">
                {/* Price */}
                <div className="text-center mb-6">
                  <div className="font-display text-4xl font-bold text-primary">
                    {event.price === 0 ? "Free" : `₹${event.price.toLocaleString()}`}
                  </div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>

                {/* Availability */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Tickets Sold</span>
                    <span className="font-medium text-foreground">
                      {event.attendees.toLocaleString()} / {event.totalCapacity.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full gradient-primary rounded-full transition-all"
                      style={{ width: `${ticketsPercentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {availableTickets.toLocaleString()} tickets remaining
                  </p>
                </div>

                {/* Ticket Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Number of Tickets
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                    >
                      -
                    </button>
                    <span className="font-semibold text-foreground text-lg w-12 text-center">
                      {ticketCount}
                    </span>
                    <button
                      onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                      className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-foreground hover:bg-muted/80 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center py-4 border-t border-border mb-6">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-display text-2xl font-bold text-foreground">
                    {event.price === 0 ? "Free" : `₹${(event.price * ticketCount).toLocaleString()}`}
                  </span>
                </div>

                {/* Book Button */}
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={handleBookTickets}
                  disabled={availableTickets === 0}
                >
                  <Ticket className="w-5 h-5 mr-2" />
                  {availableTickets === 0 ? "Sold Out" : "Book Tickets"}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By booking, you agree to our Terms of Service
                </p>
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