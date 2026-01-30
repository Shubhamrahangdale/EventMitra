import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  Eye,
  Ticket,
  TrendingUp,
  MapPin,
  Clock,
  IndianRupee,
  Image,
  X,
  Save,
  LayoutDashboard,
  CalendarDays,
  LogOut,
  Crown,
  AlertCircle,
  CreditCard,
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Users,
  Download,
  ChevronDown,
  ChevronUp,
  User,
  Mail,
  Phone,
  Hash,
} from "lucide-react";



import { toast } from "@/hooks/use-toast";

const OrganizerDashboard = () => {
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    city: "",
    category: "Cultural",
    price: "",
    totalTickets: "",
    description: "",
    image: ""
  });
  // Subscription UI state (NO blocking logic)
  const [subscription, setSubscription] = useState({
    status: "none",
    plan: "",
    eventsAllowed: 0,
    eventsUsed: 0,
    expiryDate: null,
    amount: 0,
    startDate: null,
  });
  //  Permission to create event
  const canCreateEvent =
    subscription.status === "active" &&
    (
      subscription.eventsAllowed === 999 || 
      subscription.eventsUsed < subscription.eventsAllowed
    );


  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [selectedEventForAttendees, setSelectedEventForAttendees] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState("");
const [expandedAttendees, setExpandedAttendees] = useState({});


  const handleMobileNavClick = (tabId) => {
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
  };

  const handleViewAttendees = async (event) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        `http://localhost:2511/api/bookings/event/${event._id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setAttendees(data);
      setSelectedEventForAttendees(event);
      setShowAttendeesModal(true);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to load attendees",
        variant: "destructive",
      });
    }
  };
  const subscriptionPlans = [
    {
      id: "basic",
      name: "Basic",
      price: 4999,
      events: 5,
      features: ["Up to 5 active events", "Basic analytics", "Email support"],
    },
    {
      id: "pro",
      name: "Pro",
      price: 9999,
      events: 20,
      features: ["Up to 20 active events", "Advanced analytics", "Priority support"],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 19999,
      events: "Unlimited",
      features: ["Unlimited events", "Dedicated account manager"],
    },
  ];


  const handleBuyPlan = async (plan) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "http://localhost:2511/api/subscriptions/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ planId: plan.id }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Order creation failed");

      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: "INR", 
        name: "EventMitra",
        description: plan.name,
        order_id: data.id,

        handler: async function (response) {
          const verifyRes = await fetch(
            "http://localhost:2511/api/subscriptions/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                plan: plan.id,
              }),
            }
          );


          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) throw new Error(verifyData.message);

          // ✅ UI UPDATE (THIS WAS MISSING)
          setSubscription({
            status: "active",
            plan: `${plan.name} Plan`,
            eventsAllowed: plan.events === "Unlimited" ? 999 : plan.events,
            eventsUsed: 0,
            expiryDate: new Date(
              new Date().setMonth(new Date().getMonth() + 1)
            ).toISOString(),
          });

          setShowPurchaseModal(false);
          setSelectedPlan(null);
          setActiveTab("subscription");

          toast({
            title: "Payment Successful 🎉",
            description: "Your subscription is now active",
          });
        },


        prefill: {
          name: "Organizer",
          email: "organizer@example.com",
        },

        theme: {
          color: "#2563EB",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      toast({
        title: "Payment Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };




  const handlePurchasePlan = (plan) => {
    setSelectedPlan(plan);
    setShowPurchaseModal(true);
  };
  useEffect(() => {
    const fetchEvents = async () => {
      const organizerId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          `http://localhost:2511/api/events/organizer/${organizerId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load events",
          variant: "destructive"
        });
      }
    };

    fetchEvents();
  }, []);
  useEffect(() => {
    const fetchSubscription = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(
          "http://localhost:2511/api/organizer/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch organizer");
        }

        const data = await res.json();

        if (data.subscription && data.subscription.status === "active") {
          setSubscription({
            status: "active",
            plan: `${data.subscription.plan.toUpperCase()} Plan`,
            eventsAllowed: data.subscription.eventsAllowed,
            eventsUsed: data.subscription.eventsUsed || 0,
            expiryDate: data.subscription.endDate || data.subscription.expiryDate,
            amount: data.subscription.amount || 0,
            startDate: data.subscription.startDate || null,
          });
        }
        else {
          setSubscription({
            status: "none",
            plan: "",
            eventsAllowed: 0,
            eventsUsed: 0,
            expiryDate: null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch subscription", err);
      }
    };

    fetchSubscription();
  }, []);



  const categories = ["Cultural", "Music", "Business", "Sports", "Food", "Art", "Technology", "Education"];
  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Jaipur"];

  const stats = {
    totalEvents: events.length,
    publishedEvents: events.filter(e => e.status === "published").length,
    totalTicketsSold: events.reduce((acc, e) => acc + (e.soldTickets || 0), 0),
    totalRevenue: events.reduce(
      (acc, e) => acc + ((e.soldTickets || 0) * (e.price || 0)),
      0
    ),
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      location: "",
      city: "",
      category: "Cultural",
      price: "",
      totalTickets: "",
      description: "",
      image: ""
    });
    setEditingEvent(null);
  };
  const handleCreateEvent = () => {
    if (!canCreateEvent) {
      toast({
        title: "Cannot create event",
        description:
          subscription.status !== "active"
            ? "Please purchase a subscription first"
            : "You have reached your event limit",
        variant: "destructive",
      });
      return;
    }

    resetForm();
    setShowCreateModal(true);
  };


  const handleEditEvent = (event) => {
    setActiveTab("events");
    setEditingEvent(event);

    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      city: event.city,
      category: event.category,
      price: event.price.toString(),
      totalTickets: event.totalTickets.toString(),
      description: event.description || "",
      image: event.image || ""
    });

    setShowCreateModal(true);
  };

  //handle the event 
  const handleDeleteEvent = async (eventId) => {
    const token = localStorage.getItem("token");

    try {
      await fetch(`http://localhost:2511/api/events/${eventId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEvents(prev => prev.filter(e => e._id !== eventId));

      toast({
        title: "Event Deleted",
        description: "Event deleted successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    }
  };
  //Toggle Publish and Unpublished

  const handleToggleStatus = async (eventId, currentStatus) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:2511/api/events/${eventId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: currentStatus === "published" ? "draft" : "published",
          }),
        }
      );

      const updatedEvent = await res.json();

      setEvents(prev =>
        prev.map(e => (e._id === eventId ? updatedEvent : e))
      );

      toast({
        title: "Status Updated",
        description: `Event is now ${updatedEvent.status}`,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const url = editingEvent
      ? `http://localhost:2511/api/events/${editingEvent._id}`
      : "http://localhost:2511/api/events";

    const method = editingEvent ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // will show backend message like:
        // "Only organisers can create events" or
        // "Subscription required or event limit reached ❌"
        throw new Error(data.message || "Event creation failed ❌");
      }

      const savedEvent = data.event || data; // support both shapes

      setEvents((prev) =>
        editingEvent
          ? prev.map((e) => (e._id === savedEvent._id ? savedEvent : e))
          : [savedEvent, ...prev]
      );

      toast({
        title: editingEvent ? "Event Updated" : "Event Created",
        description:
          data.message || "Event submitted for admin approval ✅",
      });

      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to save event",
        variant: "destructive",
      });
    }
  };

  const handleSubmitForApproval = async (eventId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `http://localhost:2511/api/events/${eventId}/submit`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedEvent = await res.json();

      if (!res.ok) {
        throw new Error(updatedEvent.message || "Failed to submit for approval");
      }

      setEvents((prev) =>
        prev.map((e) => (e._id === eventId ? updatedEvent : e))
      );

      toast({
        title: "Submitted for Approval",
        description: "Event sent to admin for review",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }
  };

  const confirmPurchase = () => {
    if (!selectedPlan) return;

    handleBuyPlan(selectedPlan);
  };



  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "My Events", icon: CalendarDays },
    { id: "subscription", label: "Subscription", icon: CreditCard },
  ];

  const eventStats = {
    pending: events.filter(e => e.status === "pending").length,
    active: events.filter(e => e.status === "published").length,
    expired: events.filter(e => e.status === "expired").length,
    draft: events.filter(e => e.status === "draft").length,
  };

  const toggleAttendeeDetails = (id) => {
  setExpandedAttendees(prev => ({
    ...prev,
    [id]: !prev[id],
  }));
};

const getEventAttendees = () => {
  return attendees.map((a, index) => ({
    id: index + "-" + a.email,
    name: a.name,
    email: a.email,
    phone: a.phone,
    quantity: a.quantity || 1,
    status: "confirmed",
    ticketNumber: "EVT-" + Math.floor(100000 + Math.random() * 900000),
    bookedAt: new Date().toLocaleDateString(),
    ticketHolders: [
      { name: a.name, age: a.age, gender: a.gender }
    ]
  }));
};

const downloadAttendeesPDF = () => {
  toast({
    title: "Download Started",
    description: "PDF download feature coming soon",
  });
};


  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border h-16 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-md">
            <Calendar className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display text-lg font-bold text-foreground">
            Event<span className="text-primary">Mitra</span>
          </span>
        </Link>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="left" className="w-64 p-0 bg-card border-border">
            <div className="h-full flex flex-col">
              <div className="p-6 border-b border-border">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-display text-xl font-bold text-foreground">
                    Event<span className="text-primary">Mitra</span>
                  </span>
                </Link>
              </div>

              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {sidebarItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => handleMobileNavClick(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                      >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>

              <div className="p-4 border-t border-border">
                <Link to="/">
                  <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
                    <LogOut className="w-5 h-5" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>

      <aside className="w-64 bg-card border-r border-border hidden md:flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Event<span className="text-primary">Mitra</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground">
              <LogOut className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto pt-16 md:pt-0">

        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">
                {activeTab === "dashboard" && "Organizer Dashboard"}
                {activeTab === "events" && "My Events"}
                {activeTab === "subscription" && "Subscription"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, Organizer!
              </p>
            </div>
            <Button
              onClick={handleCreateEvent}
              className="gap-2"
              disabled={!canCreateEvent}
            >

              <Plus className="w-5 h-5" />
              {!canCreateEvent
                ? subscription.status !== "active"
                  ? "Subscription Required"
                  : "Event Limit Reached"
                : "Create Event"}

            </Button>
          </div>
        </header>

        <div className="p-6">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 animate-fade-in">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Events</p>
                        <p className="font-display text-3xl font-bold text-foreground">{stats.totalEvents}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <CalendarDays className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Published</p>
                        <p className="font-display text-3xl font-bold text-foreground">{stats.publishedEvents}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Eye className="w-6 h-6 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Tickets Sold</p>
                        <p className="font-display text-3xl font-bold text-foreground">{stats.totalTicketsSold}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-card border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">Total Revenue</p>
                        <p className="font-display text-3xl font-bold text-foreground">₹{stats.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-accent" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Events */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Recent Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events.slice(0, 3).map((event) => (
                      <div key={event._id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{event.title}</h3>
                          <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
                        </div>
                        <Badge variant={event.status === "published" ? "default" : "secondary"}>
                          {event.status}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                          {event.soldTickets}/{event.totalTickets} sold
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-6 animate-fade-in">
              {events.length === 0 ? (
                <Card className="bg-card border-border">
                  <CardContent className="p-12 text-center">
                    <CalendarDays className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">No Events Yet</h3>
                    <p className="text-muted-foreground mb-6">Create your first event to get started!</p>
                    <Button
                      onClick={handleCreateEvent}
                      className="gap-2"
                      disabled={!canCreateEvent}
                    >

                      <Plus className="w-5 h-5" />
                      {!canCreateEvent
                        ? subscription.status !== "active"
                          ? "Subscription Required"
                          : "Event Limit Reached"
                        : "Create Event"}

                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {events.map((event) => (
                    <Card key={event._id} className="bg-card border-border overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full md:w-48 h-48 object-cover"
                          />
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="font-display text-xl font-semibold text-foreground">{event.title}</h3>
                                  <Badge
                                    variant={event.status === "published" ? "default" : "secondary"}
                                    className={
                                      event.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                                        event.status === "rejected" ? "bg-red-100 text-red-800" :
                                          event.status === "published" ? "bg-green-100 text-green-800" : ""
                                    }
                                  >
                                    {event.status === "pending" ? "Pending Approval" : event.status}
                                  </Badge>
                                </div>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {event.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {event.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    {event.location}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 mb-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Price</p>
                                <p className="font-semibold text-foreground">₹{event.price}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Tickets Sold</p>
                                <p className="font-semibold text-foreground">{event.soldTickets}/{event.totalTickets}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Revenue</p>
                                <p className="font-semibold text-foreground">₹{(event.soldTickets * event.price).toLocaleString()}</p>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEditEvent(event)}>
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              {event.status === "draft" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSubmitForApproval(event._id)}
                                  className="text-primary border-primary hover:bg-primary hover:text-primary-foreground"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Submit for Approval
                                </Button>
                              )}
                              {event.status === "pending" && (
                                <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                                  <Clock className="w-3 h-3 mr-1 inline" />
                                  Awaiting Admin Review
                                </Badge>
                              )}
                              <Link to={`/events/${event._id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewAttendees(event)}
                                className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                              >
                                Attendees
                              </Button>


                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteEvent(event._id)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6 animate-fade-in">
              {/* Subscription Status Card */}
              <Card className={`bg-card border-2 ${subscription.status === 'active' ? 'border-green-500/30' : subscription.status === 'expired' ? 'border-destructive/30' : 'border-accent/30'}`}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${subscription.status === 'active' ? 'bg-green-500/10' :
                        subscription.status === 'expired' ? 'bg-destructive/10' : 'bg-accent/10'
                        }`}>
                        {subscription.status === 'active' ? (
                          <Crown className="w-8 h-8 text-green-600" />
                        ) : subscription.status === 'expired' ? (
                          <AlertCircle className="w-8 h-8 text-destructive" />
                        ) : (
                          <CreditCard className="w-8 h-8 text-accent" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-display font-bold text-foreground">
                            {subscription.status === 'active' ? subscription.plan :
                              subscription.status === 'expired' ? 'Subscription Expired' : 'No Active Subscription'}
                          </h2>
                          <Badge className={`${subscription.status === 'active' ? 'bg-green-500/10 text-green-600 border-green-500/20' :
                            subscription.status === 'expired' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                              'bg-accent/10 text-accent border-accent/20'
                            }`}>
                            {subscription.status === 'active' ? 'Active' : subscription.status === 'expired' ? 'Expired' : 'None'}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground">
                          {subscription.status === 'active'
                            ? `Valid until ${new Date(subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                            : subscription.status === 'expired'
                              ? 'Renew your subscription to continue creating events'
                              : 'Subscribe to create and manage multiple events'}
                        </p>
                      </div>
                    </div>
                    {subscription.status !== 'active' && (
                      <Button className="gradient-primary text-primary-foreground gap-2">
                        <Sparkles className="w-5 h-5" />
                        Subscribe Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Details */}
              {subscription.status === 'active' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Events Used</p>
                          <p className="font-display text-3xl font-bold text-foreground">{subscription.eventsUsed}/{subscription.eventsAllowed}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <CalendarDays className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(subscription.eventsUsed / subscription.eventsAllowed) * 100}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Subscription Amount</p>
                          <p className="font-display text-3xl font-bold text-foreground">₹{(subscription.amount || 0).toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                          <IndianRupee className="w-6 h-6 text-green-600" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Per Month</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-muted-foreground text-sm">Days Remaining</p>
                          <p className="font-display text-3xl font-bold text-foreground">
                            {Math.max(0, Math.ceil((new Date(subscription.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Until renewal</p>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Event Stats when subscribed */}
              {subscription.status === 'active' && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Event Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <p className="text-2xl font-bold text-accent">{eventStats.pending}</p>
                        <p className="text-sm text-muted-foreground">Pending Approval</p>
                      </div>
                      <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                        <p className="text-2xl font-bold text-green-600">{eventStats.active}</p>
                        <p className="text-sm text-muted-foreground">Active Events</p>
                      </div>
                      <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                        <p className="text-2xl font-bold text-destructive">{eventStats.expired}</p>
                        <p className="text-sm text-muted-foreground">Expired Events</p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted border border-border">
                        <p className="text-2xl font-bold text-foreground">{eventStats.draft}</p>
                        <p className="text-sm text-muted-foreground">Draft Events</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Subscription Plans */}
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    {subscription.status === 'active' ? 'Upgrade Your Plan' : 'Choose Your Plan'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {subscriptionPlans.map((plan, index) => (
                      <div
                        key={plan.id}
                        className={`border rounded-xl p-6 transition-all hover:shadow-lg ${index === 1
                          ? 'border-2 border-primary bg-primary/5 relative'
                          : 'border-border hover:border-primary/50'
                          } ${subscription.plan === plan.name ? 'ring-2 ring-primary' : ''}`}
                      >
                        {index === 1 && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
                          </div>
                        )}
                        <h3 className="font-display text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                        <p className="text-3xl font-bold text-foreground mb-1">
                          ₹{plan.price.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground">/Month</span>
                        </p>
                        <p className="text-muted-foreground text-sm mb-4">
                          {plan.events === 'Unlimited' ? 'Unlimited events' : `Up to ${plan.events} events`}
                        </p>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full ${index === 1 ? 'gradient-primary text-primary-foreground' : ''}`}
                          variant={index === 1 ? 'default' : 'outline'}
                          onClick={() => handlePurchasePlan(plan)}
                          disabled={subscription.plan === plan.name}
                        >
                          {subscription.plan === plan.name ? 'Current Plan' : `Choose ${plan.name.split(' ')[0]}`}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Transaction & Plan Details */}
              {subscription.status === 'active' && (
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="font-display text-xl">Transaction Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg bg-muted/50 border border-border">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                              <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{subscription.plan}</p>
                              <p className="text-sm text-muted-foreground">Transaction ID: TXN{Date.now().toString().slice(-8)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-xl text-foreground">₹{(subscription.amount || 0).toLocaleString()}</p>
                            <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">Paid</Badge>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">Purchase Date</p>
                            <p className="font-medium text-foreground">
                              {new Date(subscription.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Expiry Date</p>
                            <p className="font-medium text-foreground">
                              {new Date(subscription.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Events Allowed</p>
                            <p className="font-medium text-foreground">
                              {subscription.eventsAllowed === 999 ? 'Unlimited' : subscription.eventsAllowed}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Events Remaining</p>
                            <p className="font-medium text-foreground">
                              {subscription.eventsAllowed === 999 ? 'Unlimited' : Math.max(0, subscription.eventsAllowed - subscription.eventsUsed)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create/Edit Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl font-bold text-foreground">
                {editingEvent ? "Edit Event" : "Create New Event"}
              </h2>
              <button
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title *</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Venue/Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="location"
                    className="pl-11"
                    placeholder="Enter venue name and address"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <select
                    id="city"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                  >
                    <option value="">Select city</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-foreground"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price (₹)</Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      className="pl-11"
                      placeholder="0 for free"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="totalTickets">Total Tickets</Label>
                  <div className="relative">
                    <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="totalTickets"
                      type="number"
                      className="pl-11"
                      placeholder="100"
                      value={formData.totalTickets}
                      onChange={(e) => setFormData({ ...formData, totalTickets: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Image URL</Label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="image"
                    className="pl-11"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your event..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setShowCreateModal(false); resetForm(); }}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 gap-2">
                  <Save className="w-4 h-4" />
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Plan Modal */}
      {showPurchaseModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-xl font-bold text-foreground">
                Confirm Purchase
              </h2>
              <button
                onClick={() => { setShowPurchaseModal(false); setSelectedPlan(null); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Crown className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground">{selectedPlan.name}</h3>
                <p className="text-3xl font-bold text-primary mt-2">₹{selectedPlan.price.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/Month</span></p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Events Allowed</span>
                  <span className="font-medium text-foreground">{selectedPlan.events === 'Unlimited' ? 'Unlimited' : selectedPlan.events}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Validity</span>
                  <span className="font-medium text-foreground">1 Month</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Support</span>
                  <span className="font-medium text-foreground">{selectedPlan.id === 'unlimited' ? '24/7 Phone' : selectedPlan.id === 'professional' ? 'Priority' : 'Email'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setShowPurchaseModal(false); setSelectedPlan(null); }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 gradient-primary text-primary-foreground gap-2"
                  onClick={confirmPurchase}
                >
                  <CreditCard className="w-4 h-4" />
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* View Attendees Modal */}
      <Dialog open={showAttendeesModal} onOpenChange={setShowAttendeesModal}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Attendees for {selectedEventForAttendees?.title}
            </DialogTitle>
            
          </DialogHeader>
          
          <div className="flex-1 overflow-auto">
            {selectedEventForAttendees && (
              <>
                {/* Event Summary */}
                <div className="bg-muted/50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium text-foreground">{selectedEventForAttendees.date}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="font-medium text-foreground">{selectedEventForAttendees.location}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Tickets Sold</p>
                      <p className="font-medium text-foreground">{selectedEventForAttendees.soldTickets} / {selectedEventForAttendees.totalTickets}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-medium text-primary">₹{(selectedEventForAttendees.soldTickets * selectedEventForAttendees.price).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="mb-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search attendees by name..."
                      value={attendeeSearchQuery}
                      onChange={(e) => setAttendeeSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                    <Users className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>

                {/* Attendees List */}
                {getEventAttendees(selectedEventForAttendees.id).length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">No Attendees Yet</h3>
                    <p className="text-muted-foreground">No one has booked tickets for this event yet.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(() => {
                      const allAttendees = getEventAttendees(selectedEventForAttendees.id);
                      const filteredAttendees = attendeeSearchQuery.trim() 
                        ? allAttendees.filter(a => 
                            a.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()) ||
                            a.ticketHolders?.some(h => h.name.toLowerCase().includes(attendeeSearchQuery.toLowerCase()))
                          )
                        : allAttendees;
                      
                      return (
                        <>
                          <div className="text-sm text-muted-foreground mb-2">
                            {filteredAttendees.length} booking(s) • 
                            {filteredAttendees.reduce((acc, a) => acc + a.quantity, 0)} total tickets
                            {attendeeSearchQuery && ` (filtered from ${allAttendees.length})`}
                          </div>
                          {filteredAttendees.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-muted-foreground">No attendees found matching "{attendeeSearchQuery}"</p>
                            </div>
                          ) : (
                            filteredAttendees.map((attendee) => {
                              const totalAmount = attendee.quantity * selectedEventForAttendees.price;
                              const hasMultipleTickets = attendee.quantity > 1;
                              const isExpanded = expandedAttendees[attendee.id];
                              
                              return (
                                <div 
                                  key={attendee.id} 
                                  className="bg-card border border-border rounded-lg overflow-hidden transition-shadow"
                                >
                                  {/* Compact Header - Always visible */}
                                  <div 
                                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                                    onClick={() => toggleAttendeeDetails(attendee.id)}
                                  >
                                    <div className="flex items-center justify-between gap-4">
                                      <div className="flex items-center gap-3 flex-1 min-w-0">
                                        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
                                          <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="font-semibold text-foreground">{attendee.name}</h4>
                                            {hasMultipleTickets && (
                                              <Badge className="bg-muted text-foreground border-border text-xs">
                                                <Ticket className="w-3 h-3 mr-1" />
                                                {attendee.quantity} Tickets
                                              </Badge>
                                            )}
                                            <Badge 
                                              variant={attendee.status === "confirmed" ? "default" : "secondary"}
                                              className={`text-xs ${attendee.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                            >
                                              {attendee.status}
                                            </Badge>
                                          </div>
                                          <p className="text-sm text-muted-foreground truncate">{attendee.email}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="text-right hidden sm:block">
                                          <p className="text-xs text-muted-foreground">Total</p>
                                          <p className="font-bold text-foreground">
                                            ₹{totalAmount.toLocaleString()}
                                          </p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                          {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                                          ) : (
                                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                                          )}
                                        </Button>
                                      </div>
                                    </div>
                                  </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="border-t border-border bg-muted/30 p-4 animate-fade-in">
                              {/* Ticket Holders Section - Main Focus */}
                              <div className="mb-4">
                                <h5 className="font-medium text-foreground text-sm flex items-center gap-2 mb-3">
                                  <Users className="w-4 h-4 text-primary" />
                                  Ticket Holders ({attendee.ticketHolders?.length || 0})
                                </h5>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {attendee.ticketHolders?.map((holder, index) => (
                                    <div 
                                      key={index} 
                                      className="bg-card border border-border rounded-lg p-3 flex items-center gap-3"
                                    >
                                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <span className="text-primary font-bold text-sm">{index + 1}</span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground text-sm truncate">{holder.name}</p>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                          <span>{holder.age} yrs</span>
                                          <span>•</span>
                                          <span>{holder.gender}</span>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
                                {/* Booking Contact Information */}
                                <div className="space-y-3">
                                  <h5 className="font-medium text-foreground text-sm flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Booking Contact
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Mail className="w-4 h-4" />
                                      <span>{attendee.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Phone className="w-4 h-4" />
                                      <span>{attendee.phone}</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Ticket Information */}
                                <div className="space-y-3">
                                  <h5 className="font-medium text-foreground text-sm flex items-center gap-2">
                                    <Ticket className="w-4 h-4 text-primary" />
                                    Booking Details
                                  </h5>
                                  <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Hash className="w-4 h-4" />
                                      <span className="font-mono">{attendee.ticketNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                      <Calendar className="w-4 h-4" />
                                      <span>Booked on {attendee.bookedAt}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Payment Summary */}
                              <div className="mt-4 pt-4 border-t border-border">
                                <h5 className="font-medium text-foreground text-sm flex items-center gap-2 mb-3">
                                  <CreditCard className="w-4 h-4 text-primary" />
                                  Payment Summary
                                </h5>
                                <div className="bg-card rounded-lg p-3 border border-border">
                                  <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-muted-foreground text-xs">Quantity</p>
                                      <p className="font-semibold text-foreground">
                                        {attendee.quantity} {attendee.quantity > 1 ? 'tickets' : 'ticket'}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground text-xs">Price per Ticket</p>
                                      <p className="font-medium text-foreground">₹{selectedEventForAttendees.price.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <p className="text-muted-foreground text-xs">Total Paid</p>
                                      <p className="font-bold text-lg text-foreground">
                                        ₹{totalAmount.toLocaleString()}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                          )}
                        </>
                      );
                    })()}
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>

  );
};

export default OrganizerDashboard;
