import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  MessageSquare,
  Clock
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

   const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:2511/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      toast({
        title: "Error ❌",
        description: data.message || "Something went wrong",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    toast({
      title: "Message Sent 📩",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error) {
    toast({
      title: "Server Error ❌",
      description: "Unable to connect to server",
      variant: "destructive",
    });
    console.error(error);
  }

  setIsLoading(false);
};


  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      detail: "hello@eventmitra.in",
      description: "For general inquiries",
    },
    {
      icon: Phone,
      title: "Call Us",
      detail: "+91 98765 43210",
      description: "Mon-Sat, 9 AM - 6 PM IST",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      detail: "C-DAC Knowledge Park",
      description: "Bangalore, Karnataka 560038",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-20">
        {/* Header */}
        <section className="py-16 bg-muted/30">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground">
                Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12">
          <div className="container px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="p-6 bg-card rounded-2xl shadow-elegant text-center hover-lift animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                    {info.title}
                  </h3>
                  <p className="text-primary font-medium mb-1">{info.detail}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-12">
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {/* Form */}
              <div className="bg-card p-8 rounded-2xl shadow-elegant">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-semibold text-foreground">
                      Send us a Message
                    </h2>
                    <p className="text-sm text-muted-foreground">Fill out the form below</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-12"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-12"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={handleChange}
                      className="h-12"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us more about your inquiry..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                    {isLoading ? "Sending..." : "Send Message"}
                    <Send className="w-5 h-5" />
                  </Button>
                </form>
              </div>

              {/* FAQ or Additional Info */}
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-2xl shadow-elegant">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      Response Time
                    </h3>
                  </div>
                  <p className="text-muted-foreground">
                    We typically respond within 24 hours on business days. For urgent matters, please call us directly.
                  </p>
                </div>

                <div className="bg-card p-6 rounded-2xl shadow-elegant">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Frequently Asked Questions
                  </h3>
                  <div className="space-y-4">
                    {[
                      {
                        q: "How do I create an event?",
                        a: "Simply register as an organizer, then click 'Create Event' from your dashboard.",
                      },
                      {
                        q: "What payment methods do you support?",
                        a: "We support UPI, credit/debit cards, net banking, and popular wallets.",
                      },
                      {
                        q: "Can I get a refund for cancelled events?",
                        a: "Yes, our refund policy ensures full refunds for organizer-cancelled events.",
                      },
                    ].map((faq, index) => (
                      <div key={index}>
                        <h4 className="font-medium text-foreground mb-1">{faq.q}</h4>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-muted rounded-2xl h-64 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>C-DAC Knowledge Park, Bangalore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
