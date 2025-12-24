import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Calendar, MapPin, Users, ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Cultural",
  "Music",
  "Business",
  "Sports",
  "Food",
];

const FeaturedEvents = () => {
  const [events, setEvents] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [likedEvents, setLikedEvents] = useState([]);

  // ✅ FETCH EVENTS
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("http://localhost:2511/api/events");
        const data = await res.json();

        // show only first 6 events (featured section)
        setEvents(data.slice(0, 6));
      } catch (err) {
        console.error("Failed to fetch featured events", err);
      }
    };

    fetchEvents();
  }, []);

  // ✅ FILTER BY CATEGORY
  const filteredEvents =
    activeCategory === "All"
      ? events
      : events.filter(
        event =>
          event.category?.toLowerCase() === activeCategory.toLowerCase()
      );


  // ✅ LIKE TOGGLE
  const toggleLike = (id) => {
    setLikedEvents(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            Discover Events
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4">
            Upcoming Events Near You
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through thousands of events happening across India.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map(category => (
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

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <article
              key={event._id}
              className={cn(
                "group bg-card rounded-2xl overflow-hidden shadow-elegant hover-lift animate-fade-in-up",
                `delay-${(index % 3) * 100}`
              )}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />

                {/* Like */}
                <button
                  onClick={() => toggleLike(event._id)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:scale-110"
                >
                  <Heart
                    className={cn(
                      "w-5 h-5",
                      likedEvents.includes(event._id)
                        ? "fill-destructive text-destructive"
                        : "text-foreground"
                    )}
                  />
                </button>

                {/* Category */}
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                  {event.category}
                </span>

                {/* Price */}
                <span className="absolute bottom-4 right-4 px-3 py-1 rounded-lg bg-card font-semibold">
                  {event.price ? `₹${event.price}` : "Free"}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-display text-xl font-semibold mb-3 group-hover:text-primary">
                  {event.title}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {event.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-primary" />
                    {event.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-primary" />
                    {event.totalTickets || 0}
                  </span>
                </div>

                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/events/${event._id}`}>
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link to="/events">
              View All Events
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;
