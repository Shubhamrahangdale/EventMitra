import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TicketCard } from "@/pages/TicketCard";
import { toast } from "@/hooks/use-toast";
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Edit3,
  Save,
  Ticket,
  Heart,
  Settings,
  LogOut,
  Camera,
} from "lucide-react";

const Profile = () => {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [bookedTickets, setBookedTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    location: user?.location || "",
  });

  useEffect(() => {
    if (!user) return;

    const fetchTickets = async () => {
      const res = await fetch("http://localhost:2511/api/bookings/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setBookedTickets(data);
    };

    fetchTickets();
  }, [user]);


    if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Please Login</h2>
            <Button asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  

  // Demo saved events
  const savedEvents = [
    {
      id: 3,
      name: "Holi Color Run 2025",
      date: "March 14, 2025",
      location: "Mumbai",
    },
    {
      id: 4,
      name: "Comedy Night with Zakir",
      date: "January 20, 2025",
      location: "Bangalore",
    },
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Profile Header */}
          <Card className="mb-8 overflow-hidden">
            <div className="h-32 gradient-hero relative">
              <div className="absolute inset-0 pattern-overlay opacity-30" />
            </div>
            <CardContent className="relative pt-0">
              <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <button className="absolute bottom-2 right-2 p-2 rounded-full bg-primary text-primary-foreground shadow-md hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                    <div>
                      <h1 className="font-display text-2xl font-bold text-foreground">
                        {user.name}
                      </h1>
                      <p className="text-muted-foreground flex items-center gap-2 mt-1">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <Badge variant={user.role === "organizer" ? "default" : "secondary"}>
                          {user.role === "organizer" ? "Organizer" : "Attendee"}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          Member since {user.joinedDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </Button>
                      {user.role === "organizer" && (
                        <Button asChild>
                          <Link to="/organizer">Go to Dashboard</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Tabs */}
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-md">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="tickets" className="flex items-center gap-2">
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">Tickets</span>
              </TabsTrigger>
              <TabsTrigger value="saved" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Saved</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    size="sm"
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </>
                    ) : (
                      <>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </>
                    )}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          value={formData.email}
                          disabled
                          className="pl-10 bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="+91 98765 43210"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          placeholder="Mumbai, India"
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Tell us about yourself..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tickets Tab */}
            <TabsContent value="tickets">
              <Card>
                <CardHeader>
                  <CardTitle>My Booked Tickets</CardTitle>
                </CardHeader>

                <CardContent>
                  {bookedTickets.length > 0 ? (
                    <div className="space-y-4">
                      {bookedTickets.map((ticket) => (
                        <div
                          key={ticket._id}
                          className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                        >
                          {/* LEFT */}
                          <div className="space-y-1">
                            <h4 className="font-semibold">
                              {ticket.eventTitle}
                            </h4>

                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {ticket.eventId?.date || "—"}
                              </span>

                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {ticket.eventId?.location || "—"}
                              </span>

                              <span className="flex items-center gap-1">
                                <Ticket className="w-4 h-4" />
                                {ticket.ticketCount} ticket(s)
                              </span>
                            </div>
                          </div>

                          {/* RIGHT */}
                          <div className="flex items-center gap-3 mt-4 md:mt-0">
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600"
                            >
                              {ticket.status}
                            </Badge>
                            <Button
  variant="outline"
  size="sm"
  onClick={() => setSelectedTicket(ticket)}
>
  View Ticket
</Button>

                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No tickets booked yet</p>
                      <Button asChild className="mt-4">
                        <Link to="/events">Browse Events</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>


            {/* Settings Tab */}
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about your booked events
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border">
                      <div>
                        <h4 className="font-medium">Change Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Update your account password
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between p-4 rounded-lg border border-destructive/50">
                      <div>
                        <h4 className="font-medium text-destructive">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all data
                        </p>
                      </div>
                      <Button variant="destructive" size="sm">
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* ticket priew  */}
{selectedTicket && (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
    
    {/* Scroll container */}
    <div className="relative bg-background rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">

      {/* Sticky Close Button */}
      <button
        onClick={() => setSelectedTicket(null)}
        className="sticky top-0 ml-auto block text-xl font-bold z-50"
      >
        ✕
      </button>

      <TicketCard
        bookingId={selectedTicket.bookingId}
        event={{
          name: selectedTicket.eventTitle,
          date: selectedTicket.eventId?.date,
          time: selectedTicket.eventId?.time,
          venue: selectedTicket.eventId?.location,
          imageUrl: selectedTicket.eventId?.image,
        }}
        attendees={selectedTicket.attendees.map((a, i) => ({
          name: a.name,
          age: a.age,
          gender: a.gender,
          phone: a.phone,
          ticketNumber: i + 1,
        }))}
        payment={{
          pricePerTicket: selectedTicket.pricePerTicket,
          numberOfTickets: selectedTicket.ticketCount,
          totalPaid: selectedTicket.totalAmount,
        }}
      />
    </div>
  </div>
)}



      <Footer />
    </div>
  );
};

export default Profile;
