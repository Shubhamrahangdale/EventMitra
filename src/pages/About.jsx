import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Users, 
  Target, 
  Heart, 
  Award,
  ArrowRight,
  Sparkles
} from "lucide-react";

const team = [
  {
    name: "Shubham D. Rahangdale",
    image: "https://github.com/Shubhamrahangdale/images/blob/main/Shubham.jpg?raw=true",
  },
  {
    name: "Rishi R. Singh",
    image: "https://github.com/Shubhamrahangdale/images/blob/main/Rishi.jpg?raw=true",
  },
  {
    name: "Yash S. Dudhe",
    image: "https://github.com/Shubhamrahangdale/images/blob/main/YashDudhe.jpg?raw=true",
  },
  {
    name: "Yash V. Sonkuwar",
    image: "https://github.com/Shubhamrahangdale/images/blob/main/yashSonkuwar.jpg?raw=true",
  },
];


const values = [
  {
    icon: Target,
    title: "Mission Driven",
    description: "We're on a mission to make event management accessible, efficient, and enjoyable for everyone in India.",
  },
  {
    icon: Heart,
    title: "User First",
    description: "Every feature we build starts with understanding the real needs of event organizers and attendees.",
  },
  {
    icon: Users,
    title: "Community Focused",
    description: "We believe in the power of communities and events that bring people together.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in everything we do, from code quality to customer support.",
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 gradient-hero opacity-10" />
          <div className="container relative z-10 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 mb-6">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">About Us</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-6">
                Making Events
                <span className="text-gradient block">Memorable</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                EventMitra is India's premier event management platform, designed to simplify event organization while creating unforgettable experiences for attendees across the nation.
              </p>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Our Story
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    EventMitra was born out of a simple observation: organizing events in India, whether it's a corporate conference, a wedding, or a cultural festival, is incredibly complex and often frustrating.
                  </p>
                  <p>
                    As a team of developers and event enthusiasts from C-DAC Bangalore, we set out to build a platform that would make event management as seamless as possible. Our goal was to create something that works for India – understanding the unique challenges of hosting events across diverse cities, cultures, and scales.
                  </p>
                  <p>
                    Today, EventMitra serves thousands of event organizers across 25+ Indian cities, from intimate workshops to large-scale conferences with thousands of attendees.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800"
                  alt="Team collaboration"
                  className="rounded-2xl shadow-elegant"
                />
                <div className="absolute -bottom-6 -left-6 bg-card p-6 rounded-2xl shadow-elegant">
                  <div className="font-display text-4xl font-bold text-primary">2025</div>
                  <div className="text-sm text-muted-foreground">Established</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These core values guide everything we do at EventMitra.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-2xl shadow-elegant hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-5">
                    <value.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-muted/30">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                Meet Our Team
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                PG-DAC August 2025 Batch • Group 04 • C-DAC Bangalore
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
              {team.map((member, index) => (
                <div
                  key={index}
                  className="text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative mb-4 mx-auto w-40 h-40">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-4 ring-primary/20" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of event organizers who trust EventMitra for their events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/register">
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
