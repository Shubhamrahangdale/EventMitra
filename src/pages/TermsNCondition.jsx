import { Link } from "react-router-dom";
import { Calendar, ArrowLeft, Users, Heart, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const TermsConditions = () => {
  const teamMembers = [
    { name: "Shubham Rahangadale", role: "Developer" },
    { name: "Yash Dudhe", role: "Developer" },
    { name: "Yash Sonkuwar", role: "Developer" },
    { name: "Rishi Singh", role: "Developer" },
  ];

  const mentor = { name: "Akshya K", role: "Project Guide & Mentor" };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent py-12">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <h1 className="font-display text-4xl font-bold text-foreground">Terms & Conditions</h1>
            <p className="text-muted-foreground mt-2">Please read these terms carefully before using EventMitra</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Terms Sections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">1</span>
                  Acceptance of Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>By accessing and using EventMitra, you accept and agree to be bound by the terms and provision of this agreement.</p>
                <p>If you do not agree to abide by the above, please do not use this service.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">2</span>
                  User Registration
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>Users must register with valid information to access certain features of EventMitra.</p>
                <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
                <p>You agree to notify us immediately of any unauthorized use of your account.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">3</span>
                  Event Booking & Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>All event bookings are subject to availability and confirmation.</p>
                <p>Payments are processed securely through our payment partners.</p>
                <p>Refund policies are determined by individual event organizers.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">4</span>
                  Organizer Responsibilities
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>Event organizers are responsible for the accuracy of event information.</p>
                <p>Organizers must comply with all local laws and regulations for their events.</p>
                <p>EventMitra reserves the right to remove events that violate our guidelines.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">5</span>
                  Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-3">
                <p>We respect your privacy and are committed to protecting your personal data.</p>
                <p>Your information will only be used for the purposes outlined in our privacy policy.</p>
                <p>We do not sell or share your personal information with third parties without consent.</p>
              </CardContent>
            </Card>

            {/* Team Credits Section */}
            <div className="pt-8 border-t border-border">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary font-medium mb-4">
                  <Heart className="w-4 h-4" />
                  Made with Love
                </div>
                <h2 className="font-display text-3xl font-bold text-foreground">Our Team</h2>
                <p className="text-muted-foreground mt-2">This project was built by passionate developers</p>
              </div>

              {/* Team Members */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                        <Code className="w-8 h-8 text-primary-foreground" />
                      </div>
                      <h3 className="font-semibold text-foreground">{member.name}</h3>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Mentor */}
              <Card className="max-w-md mx-auto text-center border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <p className="text-sm text-primary font-medium mb-1">Under the Guidance of</p>
                  <h3 className="font-display text-xl font-bold text-foreground">{mentor.name}</h3>
                  <p className="text-muted-foreground">{mentor.role}</p>
                </CardContent>
              </Card>
            </div>

            {/* Footer Note */}
            <div className="text-center pt-8">
              <p className="text-muted-foreground text-sm">
                © 2025 EventMitra. All rights reserved.
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Last updated: January 2025
              </p>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsConditions;
