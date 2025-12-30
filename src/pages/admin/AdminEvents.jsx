import React, { useState } from "react";
import {
  Search,
  Eye,
  Check,
  X,
  MoreHorizontal,
  Calendar,
} from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";

import { useEvents } from "@/context/EventContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const AdminEvents = () => {
  const { events, approveEvent, rejectEvent } = useEvents();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const filteredEvents = (events || []).filter((event) => {
    const title = event.title || "";
    const organiserName = event.organiserName || "";
    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organiserName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprove = async (event) => {
    await approveEvent(event._id || event.id);
    toast({
      title: "Event Approved",
      description: `"${event.title}" is now visible.`,
    });
  };

  const handleReject = async (event) => {
    await rejectEvent(event._id || event.id);
    toast({
      title: "Event Rejected",
      description: `"${event.title}" rejected.`,
      variant: "destructive",
    });
  };
const getStatusBadge = (status) => {
  if (status === "published") {
    return (
      <Badge className="bg-success/10 text-success">
        Approved
      </Badge>
    );
  }
  if (status === "rejected") {
    return (
      <Badge className="bg-destructive/10 text-destructive">
        Rejected
      </Badge>
    );
  }
  return (
    <Badge className="bg-accent/20 text-accent-foreground">
      Pending
    </Badge>
  );
};

 

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Event Management
          </h1>
          <p className="text-muted-foreground">
            Review and approve events
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
  {events.filter((e) => e.status === "pending").length}
</p>
                <p className="text-sm text-muted-foreground">Pending</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <Check className="w-6 h-6 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold">
  {events.filter((e) => e.status === "published").length}
</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <X className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">
  {events.filter((e) => e.status === "rejected").length}
</p>
                
                <p className="text-sm text-muted-foreground">Rejected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
<SelectItem value="pending">Pending</SelectItem>
<SelectItem value="published">Approved</SelectItem>
<SelectItem value="rejected">Rejected</SelectItem>

                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Events ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 text-sm text-muted-foreground">
                    Event
                  </th>
                  <th className="text-left py-4 px-4 text-sm text-muted-foreground">
                    Organiser
                  </th>
                  <th className="text-left py-4 px-4 text-sm text-muted-foreground">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-sm text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event) => (
                  <tr
                    key={event._id || event.id}
                    className="border-b border-border/50"
                  >
                    <td className="py-4 px-4">
                      <p className="font-medium text-foreground">
                        {event.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {event.category}
                      </p>
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {event.organiserName}
                    </td>
                    <td className="py-4 px-4 text-sm">
                      {event.date
                        ? new Date(event.date).toLocaleDateString(
                            "en-IN"
                          )
                        : "-"}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(event.status)}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {event.status === "pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-success"
                              onClick={() => handleApprove(event)}
                            >
                              <Check className="w-5 h-5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleReject(event)}
                            >
                              <X className="w-5 h-5" />
                            </Button>
                          </>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedEvent(event);
                                setIsViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredEvents.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No events found.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={isViewDialogOpen}
          onOpenChange={setIsViewDialogOpen}
        >
          <DialogContent className="glass max-w-lg">
            <DialogHeader>
              <DialogTitle>Event Details</DialogTitle>
            </DialogHeader>
            {selectedEvent && (
              <div className="space-y-4 pt-4">
                <h3 className="text-xl font-semibold">
                  {selectedEvent.title}
                </h3>
                <p className="text-muted-foreground">
                  {selectedEvent.description}
                </p>
                <p>Date: {selectedEvent.date}</p>
                <p>Venue: {selectedEvent.venue}</p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminEvents;
