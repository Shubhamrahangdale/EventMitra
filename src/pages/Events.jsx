import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  Calendar,
  MapPin,
  Users,
  Filter,
  ArrowRight,
  Heart,
  SlidersHorizontal
} from "lucide-react";
import { cn } from "@/lib/utils";



const categories = ["All",
  "Cultural",
  "Music",
  "Business",
  "Sports",
  "Food",
  "Arts",
  "Technology",
  "Education"];
const cities = ["All Cities", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Kolkata"];
const priceRanges = ["Any Price", "Free", "Under ₹1000", "₹1000 - ₹5000", "Above ₹5000"];

const Events = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedPrice, setSelectedPrice] = useState("Any Price");
  const [showFilters, setShowFilters] = useState(false);
  const [likedEvents, setLikedEvents] = useState([]);
  const [bookedEventIds, setBookedEventIds] = useState([]);

  const [searchParams] = useSearchParams();
  const selectedCategory = searchParams.get("category");


useEffect(() => {
  if (selectedCategory) {
    setActiveCategory(selectedCategory);
  } else {
    setActiveCategory("All");
  }
}, [selectedCategory]);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:2511/api/events");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      }
    };

    fetchEvents();
  }, []);


useEffect(() => {
  const token = localStorage.getItem("token");

  const fetchMyBookings = async () => {
    if (!token) {
      setBookedEventIds([]); 
      return;
    }

    try {
      const res = await fetch("http://localhost:2511/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      const ids = data.map((b) => b.eventId?._id).filter(Boolean);
      setBookedEventIds(ids);
    } catch (err) {
      console.error("Failed to fetch bookings");
      setBookedEventIds([]);
    }
  };

  fetchMyBookings();
}, [localStorage.getItem("token")]);




const filteredEvents = events
  .map(event => ({
    ...event,
    isBooked: bookedEventIds.includes(event._id),
  }))
  .filter(event => {
    const title = event.title ?? "";
    const description = event.description ?? "";

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      event.category?.toLowerCase() === activeCategory.toLowerCase();

    const matchesCity =
      selectedCity === "All Cities" || event.city === selectedCity;

    let matchesPrice = true;
    const price = event.price ?? 0;

    if (selectedPrice === "Free") matchesPrice = price === 0;
    else if (selectedPrice === "Under ₹1000") matchesPrice = price < 1000;
    else if (selectedPrice === "₹1000 - ₹5000")
      matchesPrice = price >= 1000 && price <= 5000;
    else if (selectedPrice === "Above ₹5000") matchesPrice = price > 5000;

    return matchesSearch && matchesCategory && matchesCity && matchesPrice;
  })
  // 🔥 IMPORTANT: booked events first
  .sort((a, b) => Number(b.isBooked) - Number(a.isBooked));


  const toggleLike = (id) => {
    setLikedEvents((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Header */}
        <div className="bg-secondary/5 py-12 md:py-16">
          <div className="container px-4">
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Browse thousands of events happening across India. Find conferences, festivals, workshops, and more.
            </p>

            {/* Search Bar */}
            <div className="mt-8 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search events by name, keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 text-base"
                />
              </div>
              <Button
                variant="outline"
                className="h-12 px-6"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-5 h-5 mr-2" />
                Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-6 p-6 bg-card rounded-2xl shadow-elegant animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    >
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Price Range</label>
                    <select
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg border border-input bg-background text-foreground"
                    >
                      {priceRanges.map((range) => (
                        <option key={range} value={range}>{range}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setSelectedCity("All Cities");
                        setSelectedPrice("Any Price");
                        setActiveCategory("All");
                        setSearchQuery("");
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="container px-4 py-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="container px-4">
          <div className="flex items-center justify-between mb-6">
            <p className="text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredEvents.length}</span> events
            </p>
          </div>

          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredEvents.map((event, index) => (
                <article
                  key={event._id}
                  className="group bg-card rounded-2xl overflow-hidden shadow-elegant hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${(index % 4) * 50}ms` }}
                >
                  {/* Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

                    <button
                      onClick={() => toggleLike(event._id)}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center transition-transform hover:scale-110"
                    >
                      <Heart
                        className={cn(
                          "w-4 h-4 transition-colors",
                          likedEvents.includes(event._id)
                            ? "fill-destructive text-destructive"
                            : "text-foreground"
                        )}
                      />
                    </button>

                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                      {event.category}
                    </span>
                    {event.isBooked && (
  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-green-600 text-white text-xs font-semibold">
    ✔ Booked
  </span>
)}


                    <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-card font-semibold text-sm text-foreground">
                      {event.price === 0 ? "Free" : `₹${(event.price ?? 0).toLocaleString()}
`}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>

                    <div className="space-y-1.5 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary" />
                        {event.date} • {event.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.city}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-primary" />
                        {(event.soldTickets || 0).toLocaleString()} / {(event.totalTickets || 0).toLocaleString()} attending


                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to={`/events/${event._id}`}>
                        View Details
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Filter className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search query
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedCity("All Cities");
                  setSelectedPrice("Any Price");
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Events;
