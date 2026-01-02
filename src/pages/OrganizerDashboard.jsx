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
  Settings,
  LogOut,
  Crown,
  AlertCircle,
  CreditCard,
  Sparkles,
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
    status: "none", // "none" | "active" | "expired"
    plan: "",
    eventsAllowed: 0,
    eventsUsed: 0,
    expiryDate: null,
  });
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);


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
        currency: "INR", // ✅ VERY IMPORTANT
        name: "EventMitra",
        description: plan.name,
        order_id: data.orderId,

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

      try {
        const res = await fetch(
          "http://localhost:2511/api/organizer/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.subscription && data.subscription.status === "active") {
          setSubscription({
            status: "active",
            plan: `${data.subscription.plan} Plan`,
            eventsAllowed: data.subscription.eventsAllowed,
            eventsUsed: data.subscription.eventsUsed || 0,
            expiryDate: data.subscription.expiryDate,
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

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "My Events", icon: CalendarDays },
    { id: "subscription", label: "Subscription", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
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
      <main className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-slate-900">
                {activeTab === "dashboard" && "Organizer Dashboard"}
                {activeTab === "events" && "My Events"}
                {activeTab === "subscription" && "Subscription"}
                {activeTab === "settings" && "Settings"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Welcome back, Organizer!
              </p>
            </div>
            <Button onClick={handleCreateEvent} className="gap-2">
              <Plus className="w-5 h-5" />
              Create Event
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
                    <Button onClick={handleCreateEvent} className="gap-2">
                      <Plus className="w-5 h-5" />
                      Create Event
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
                                  <Badge variant={event.status === "published" ? "default" : "secondary"}>
                                    {event.status}
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
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(event._id, event.status)}
                              >

                                <Eye className="w-4 h-4 mr-1" />
                                {event.status === "published" ? "Unpublish" : "Publish"}
                              </Button>
                              <Link to={`/events/${event._id}`}>
                                <Button variant="outline" size="sm">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </Link>
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
            <div className="space-y-6">
              <Card
                className={`bg-white border-2 rounded-2xl ${subscription.status === "active"
                    ? "border-green-500/30"
                    : subscription.status === "expired"
                      ? "border-red-500/30"
                      : "border-orange-300/40"
                  }`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center ${subscription.status === "active"
                            ? "bg-green-500/10"
                            : subscription.status === "expired"
                              ? "bg-red-500/10"
                              : "bg-orange-100"
                          }`}
                      >
                        {subscription.status === "active" ? (
                          <Crown className="w-8 h-8 text-green-600" />
                        ) : subscription.status === "expired" ? (
                          <AlertCircle className="w-8 h-8 text-red-500" />
                        ) : (
                          <CreditCard className="w-8 h-8 text-orange-500" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-2xl font-display font-bold text-slate-900">
                            {subscription.status === "active"
                              ? subscription.plan
                              : subscription.status === "expired"
                                ? "Subscription Expired"
                                : "No Active Subscription"}
                          </h2>
                          <Badge
                            className={`${subscription.status === "active"
                                ? "bg-green-500/10 text-green-600 border-green-500/20"
                                : subscription.status === "expired"
                                  ? "bg-red-500/10 text-red-500 border-red-500/20"
                                  : "bg-orange-100 text-orange-700 border-orange-200"
                              }`}
                          >
                            {subscription.status === "active"
                              ? "Active"
                              : subscription.status === "expired"
                                ? "Expired"
                                : "None"}
                          </Badge>
                        </div>
                        <p className="text-slate-500">
                          {subscription.status === "active"
                            ? `Valid until ${new Date(
                              subscription.expiryDate
                            ).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}`
                            : subscription.status === "expired"
                              ? "Renew your subscription to continue creating events"
                              : "Subscribe to create and manage multiple events"}
                        </p>
                      </div>
                    </div>
                    {subscription.status !== "active" && (
                      <Button
                        className="bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 gap-2"
                        onClick={() => setShowPurchaseModal(true)}
                      >
                        <Sparkles className="w-5 h-5" />
                        Subscribe Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {subscription.status === "active" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-white border border-slate-100 rounded-2xl">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-slate-500 text-sm">
                            Events Used
                          </p>
                          <p className="font-display text-3xl font-bold text-slate-900">
                            {subscription.eventsUsed}/{subscription.eventsAllowed}
                          </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                          <CalendarDays className="w-6 h-6 text-orange-500" />
                        </div>
                      </div>
                      <div className="mt-4 w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all"
                          style={{
                            width: `${subscription.eventsAllowed > 0
                                ? (subscription.eventsUsed /
                                  subscription.eventsAllowed) *
                                100
                                : 0
                              }%`,
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-slate-100 rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-slate-500 text-sm mb-2">Plan</p>
                      <p className="font-display text-xl font-bold text-slate-900">
                        {subscription.plan || "N/A"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-white border border-slate-100 rounded-2xl">
                    <CardContent className="p-6">
                      <p className="text-slate-500 text-sm mb-2">Status</p>
                      <p className="font-display text-xl font-bold text-slate-900 capitalize">
                        {subscription.status}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subscriptionPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`bg-white border border-slate-100 rounded-2xl relative ${plan.id === "pro" ? "border-orange-400" : ""
                      }`}
                  >
                    {plan.id === "pro" && (
                      <div className="absolute -top-2 right-4 px-2 py-0.5 rounded-full bg-orange-500 text-white text-xs">
                        Most popular
                      </div>
                    )}
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-1">
                        <h3 className="font-display text-xl font-semibold text-slate-900">
                          {plan.name}
                        </h3>
                        <p className="text-slate-500 text-sm">
                          {plan.highlight}
                        </p>
                      </div>
                      <p className="font-display text-3xl font-bold text-slate-900">
                        ₹{plan.price}
                        <span className="text-sm font-normal text-slate-500">
                          /month
                        </span>
                      </p>
                      <p className="text-sm text-slate-500">
                        Up to {plan.events} active events
                      </p>
                      <ul className="space-y-1 text-sm text-slate-500">
                        {plan.features.map((f) => (
                          <li key={f}>• {f}</li>
                        ))}
                      </ul>
                      <Button
                        className="w-full mt-2 rounded-full"
                        variant={plan.id === "pro" ? "default" : "outline"}
                        onClick={() => handlePurchasePlan(plan)}
                      >
                        Choose {plan.name}
                      </Button>

                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}



          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6 animate-fade-in">
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl">Organizer Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="orgName">Organization Name</Label>
                      <Input id="orgName" placeholder="Your organization name" defaultValue="EventMitra Organizers" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgEmail">Email</Label>
                      <Input id="orgEmail" type="email" placeholder="contact@example.com" defaultValue="organizer@eventmitra.com" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgPhone">Phone</Label>
                      <Input id="orgPhone" type="tel" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="orgCity">City</Label>
                      <Input id="orgCity" placeholder="Your city" defaultValue="Mumbai" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="orgBio">Bio</Label>
                    <Textarea
                      id="orgBio"
                      placeholder="Tell attendees about your organization..."
                      defaultValue="We are a premier event management company specializing in cultural and corporate events across India."
                      rows={4}
                    />
                  </div>
                  <Button className="gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </Button>
                </CardContent>
              </Card>
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
      {/* Subscription purchase modal */}
      {showPurchaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="font-display text-2xl font-bold text-slate-900">
                Confirm Subscription
              </h2>
              <button
                onClick={() => {
                  setShowPurchaseModal(false);
                  setSelectedPlan(null);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-slate-600 text-sm">
                You are about to purchase the{" "}
                <span className="font-semibold">
                  {selectedPlan?.name} Plan
                </span>{" "}
                for{" "}
                <span className="font-semibold">
                  ₹{selectedPlan?.price}/month
                </span>
                .
              </p>
              <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
                {selectedPlan?.features?.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-full"
                  onClick={() => {
                    setShowPurchaseModal(false);
                    setSelectedPlan(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 gap-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!selectedPlan}
                  onClick={() => handleBuyPlan(selectedPlan)}
                >
                  <CreditCard className="w-4 h-4" />
                  Confirm & Pay {selectedPlan?.name}
                </Button>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
