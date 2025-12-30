import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Calendar,
  TrendingUp,
  UserPlus,
  CreditCard,
  IndianRupee,
  CalendarDays,
  Clock,
} from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import { useOrganisers } from "@/context/OrganiserContext";
import { useEvents } from "@/context/EventContext";
import { useAdmin } from "@/context/AdminContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const AdminDashboard = () => {
  const { organisers } = useOrganisers();
  const { events } = useEvents();
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [isAuthenticated, navigate]);

  // map backend statuses: events use "pending" | "published" | "rejected"
  const statsData = {
    total: organisers.length,
    active: organisers.filter((o) => o.status === "active").length,
    pending: organisers.filter((o) => o.status === "pending").length,

    totalEvents: events.length,
    pendingEvents: events.filter((e) => e.status === "pending").length,
    approvedEvents: events.filter((e) => e.status === "published").length,

    activeSubscriptions: organisers.filter(
      (o) => o.subscription?.status === "active"
    ).length,
    totalRevenue: organisers
      .filter((o) => o.subscription?.status === "active")
      .reduce((sum, o) => sum + (o.subscription?.amount || 0), 0),
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  const stats = [
    {
      icon: Users,
      label: "Total Organisers",
      value: statsData.total,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: UserPlus,
      label: "Pending Approvals",
      value: statsData.pending,
      color: "text-accent",
      bg: "bg-accent/10",
    },
    {
      icon: CreditCard,
      label: "Active Subscriptions",
      value: statsData.activeSubscriptions,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      icon: IndianRupee,
      label: "Total Revenue",
      value: formatCurrency(statsData.totalRevenue),
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: CalendarDays,
      label: "Total Events",
      value: statsData.totalEvents,
      color: "text-secondary",
      bg: "bg-secondary/10",
    },
    {
      icon: Clock,
      label: "Pending Events",
      value: statsData.pendingEvents,
      color: "text-accent",
      bg: "bg-accent/10",
    },
  ];

  const recentOrganisers = [...organisers]
    .sort(
      (a, b) =>
        new Date(b.joinedDate || b.createdAt || 0).getTime() -
        new Date(a.joinedDate || a.createdAt || 0).getTime()
    )
    .slice(0, 5);

  const pendingEvents = events
    .filter((e) => e.status === "pending")
    .slice(0, 5);

  const getStatusBadge = (status) => {
    if (status === "active")
      return (
        <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">
          Active
        </Badge>
      );
    if (status === "pending")
      return (
        <Badge className="bg-accent/10 text-accent border border-accent/20">
          Pending
        </Badge>
      );
    if (status === "inactive")
      return (
        <Badge className="bg-muted text-muted-foreground border border-border">
          Inactive
        </Badge>
      );
    return (
      <Badge className="bg-destructive/10 text-destructive border border-destructive/20">
        Rejected
      </Badge>
    );
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={stat.label}
              className="bg-card border-border hover-lift animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Organisers */}
          <Card className="bg-card border-border animate-fade-in-up delay-400">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">
                Recent Organisers
              </CardTitle>
              <Link
                to="/admin/organisers"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrganisers.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No organisers yet
                  </p>
                ) : (
                  recentOrganisers.map((org) => (
                    <div
                      key={org._id || org.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                          {org.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">
                            {org.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {org.company}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {getStatusBadge(org.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pending Events */}
          <Card className="bg-card border-border animate-fade-in-up delay-500">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-display">
                Pending Events
              </CardTitle>
              <Link
                to="/admin/events"
                className="text-sm text-primary hover:underline"
              >
                View all
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingEvents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No pending events
                  </p>
                ) : (
                  pendingEvents.map((event) => (
                    <div
                      key={event._id || event.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {event.image && (
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-foreground">
                            {event.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            by {event.organiserName}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-accent/10 text-accent border border-accent/20">
                        Pending
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
