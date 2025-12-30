import React, { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  CreditCard,
  IndianRupee,
  Calendar,
} from "lucide-react";

import AdminLayout from "@/components/layout/AdminLayout";
import { useOrganisers } from "@/context/OrganiserContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

const AdminOrganisers = () => {
  const { organisers, fetchAllOrganisers } = useOrganisers();
  const { toast } = useToast();
  const adminToken = localStorage.getItem("adminToken");

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [subscriptionFilter, setSubscriptionFilter] = useState("all");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] =
    useState(false);

  const [selectedOrganiser, setSelectedOrganiser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    // company: "",
    status: "pending",
  });

  const [subscriptionData, setSubscriptionData] = useState({
    plan: "annual",
    status: "pending",
    amount: 29999,
    eventsAllowed: 50,
  });

  // load organisers from backend (all)
  useEffect(() => {
    if (adminToken) {
      fetchAllOrganisers();
    }
  }, [adminToken, fetchAllOrganisers]);

  const filteredOrganisers = (organisers || []).filter((org) => {
    const matchesSearch =
      org.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email?.toLowerCase().includes(searchQuery.toLowerCase())
      //  ||
      // org.company?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || org.status === statusFilter;
    const matchesSubscription =
      subscriptionFilter === "all" ||
      org.subscription?.status === subscriptionFilter;
    return matchesSearch && matchesStatus && matchesSubscription;
  });

  const resetForm = () =>
    setFormData({
      name: "",
      email: "",
      phone: "",
      // company: "",
      status: "pending",
    });

  // ADD organiser (admin creates organiser account)
  const handleAdd = async () => {
    if (!formData.name || !formData.email || !formData.phone ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await fetch("http://localhost:2511/admin/organisers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast({
        title: "Organiser Added",
        description: `${formData.name} has been added successfully.`,
      });
      setIsAddDialogOpen(false);
      resetForm();
      fetchAllOrganisers();
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Failed to add organiser",
        variant: "destructive",
      });
    }
  };

  // EDIT organiser
  const handleEdit = async () => {
    if (!selectedOrganiser) return;
    try {
      const res = await fetch(
        `http://localhost:2511/admin/organisers/${selectedOrganiser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error();

      toast({
        title: "Organiser Updated",
        description: `${formData.name} has been updated successfully.`,
      });
      setIsEditDialogOpen(false);
      setSelectedOrganiser(null);
      resetForm();
      fetchAllOrganisers();
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Failed to update organiser",
        variant: "destructive",
      });
    }
  };

  // DELETE organiser
  const handleDelete = async (organiser) => {
    try {
      const res = await fetch(
        `http://localhost:2511/admin/organisers/${organiser._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (!res.ok) throw new Error();

      toast({
        title: "Organiser Deleted",
        description: `${organiser.name} has been removed.`,
      });
      fetchAllOrganisers();
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Failed to delete organiser",
        variant: "destructive",
      });
    }
  };

  // APPROVE organiser
  const approveOrganiser = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:2511/admin/organisers/${id}/approve`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (!res.ok) throw new Error();

      toast({
        title: "Approved ✅",
        description: "Organiser can now login",
      });
      fetchAllOrganisers();
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Approval failed",
        variant: "destructive",
      });
    }
  };

  // UPDATE subscription
  const handleSubscriptionUpdate = async () => {
    if (!selectedOrganiser) return;
    try {
      const res = await fetch(
        `http://localhost:2511/api/admin/organisers/${selectedOrganiser._id}/subscription`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(subscriptionData),
        }
      );

      if (!res.ok) throw new Error();

      toast({
        title: "Subscription updated ✅",
        description: `${selectedOrganiser.name}'s subscription was updated.`,
      });
      setIsSubscriptionDialogOpen(false);
      setSelectedOrganiser(null);
      fetchAllOrganisers();
    } catch (err) {
      toast({
        title: "Error ❌",
        description: "Failed to update subscription",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (organiser) => {
    setSelectedOrganiser(organiser);
    setFormData({
      name: organiser.name || "",
      email: organiser.email || "",
      phone: organiser.phone || "",
      // company: organiser.company || "",
      status: organiser.status || "pending",
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (organiser) => {
    setSelectedOrganiser(organiser);
    setIsViewDialogOpen(true);
  };

  const openSubscriptionDialog = (organiser) => {
    setSelectedOrganiser(organiser);
    setSubscriptionData({
      plan: organiser.subscription?.plan || "annual",
      status: organiser.subscription?.status || "pending",
      amount: organiser.subscription?.amount || 29999,
      eventsAllowed: organiser.subscription?.eventsAllowed || 50,
    });
    setIsSubscriptionDialogOpen(true);
  };

  const getSubscriptionBadge = (subscription = {}) => {
    if (subscription.status === "active") {
      return <Badge className="subscription-active">Active</Badge>;
    }
    if (subscription.status === "expired") {
      return <Badge className="subscription-expired">Expired</Badge>;
    }
    return <Badge className="subscription-pending">Pending</Badge>;
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);

  return (
    <AdminLayout>
      <div className="p-8">
        {/* HEADER + ADD DIALOG (UI unchanged) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground mb-2">
              Manage Organisers
            </h1>
            <p className="text-muted-foreground">
              Add, edit, and manage event organisers & subscriptions
            </p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add Organiser
              </Button>
            </DialogTrigger>
            <DialogContent className="glass max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-2xl">
                  Add New Organiser
                </DialogTitle>
                <DialogDescription>
                  Fill in the details to add a new event organiser.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <Input
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
                {/* <Input
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                /> */}
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsAddDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="hero"
                    className="flex-1"
                    onClick={handleAdd}
                  >
                    Add Organiser
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* FILTER CARD (UI unchanged) */}
        <Card className="glass mb-6 animate-fade-in-up">
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
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={subscriptionFilter}
                onValueChange={setSubscriptionFilter}
              >
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Subscription" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* TABLE (UI unchanged, handlers wired) */}
        <Card className="glass animate-fade-in-up delay-200">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Organisers ({filteredOrganisers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                      Organiser
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                      Contact
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                      Subscription
                    </th>
                    <th className="text-left py-4 px-4 text-sm font-semibold text-muted-foreground">
                      Events
                    </th>
                    <th className="text-right py-4 px-4 text-sm font-semibold text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrganisers.map((organiser) => (
                    <tr
                      key={organiser._id}
                      className="border-b border-border/50 table-row-hover"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-semibold">
                            {organiser.name?.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {organiser.name}
                            </p>
                            {/* <p className="text-sm text-muted-foreground">
                              {organiser.company}
                            </p> */}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground">
                          {organiser.email}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {organiser.phone}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            organiser.status === "active"
                              ? "bg-success/10 text-success"
                              : organiser.status === "pending"
                              ? "bg-accent/20 text-accent-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {organiser.status
                            ? organiser.status.charAt(0).toUpperCase() +
                              organiser.status.slice(1)
                            : ""}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {getSubscriptionBadge(organiser.subscription)}
                      </td>
                      {/* <td className="py-4 px-4">
                        <span className="text-foreground font-medium">
                          {organiser.eventsManaged || 0}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {" "}
                          / {organiser.subscription?.eventsAllowed || 0}
                        </span>
                      </td> */}
                    <td className="py-4 px-4">
  <span className="text-foreground font-medium">
    {organiser.subscription?.eventsUsed || 0}
  </span>
  <span className="text-xs text-muted-foreground">
    {" "}
    / {organiser.subscription?.eventsAllowed || 0}
  </span>
</td>


                      <td className="py-4 px-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="glass"
                          >
                            <DropdownMenuItem
                              onClick={() => openViewDialog(organiser)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => openEditDialog(organiser)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                openSubscriptionDialog(organiser)
                              }
                            >
                              <CreditCard className="w-4 h-4 mr-2" />
                              Subscription
                            </DropdownMenuItem>
                            {organiser.status === "pending" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  approveOrganiser(organiser._id)
                                }
                              >
                                Approve
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDelete(organiser)}
                              className="text-destructive"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredOrganisers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    No organisers found.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* EDIT dialog (UI unchanged, handler wired) */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Edit Organiser
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              {/* <Input
                placeholder="Company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              /> */}
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleEdit}
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* VIEW dialog (UI unchanged) */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="glass max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Organiser Details
              </DialogTitle>
            </DialogHeader>
            {selectedOrganiser && (
              <div className="space-y-4 pt-4">
                <p className="font-medium text-foreground">
                  {selectedOrganiser.name}
                </p>
                <p className="text-muted-foreground">
                  {selectedOrganiser.email}
                </p>
                {/* <p className="text-muted-foreground">
                  {selectedOrganiser.company}
                </p> */}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* SUBSCRIPTION dialog (UI unchanged, handler wired) */}
        <Dialog
          open={isSubscriptionDialogOpen}
          onOpenChange={setIsSubscriptionDialogOpen}
        >
          <DialogContent className="glass max-w-md">
            <DialogHeader>
              <DialogTitle className="font-display text-2xl">
                Manage Subscription
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Select
                value={subscriptionData.status}
                onValueChange={(value) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    status: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Amount"
                value={subscriptionData.amount}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    amount: Number(e.target.value),
                  })
                }
              />
              <Input
                type="number"
                placeholder="Events Allowed"
                value={subscriptionData.eventsAllowed}
                onChange={(e) =>
                  setSubscriptionData({
                    ...subscriptionData,
                    eventsAllowed: Number(e.target.value),
                  })
                }
              />
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsSubscriptionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="hero"
                  className="flex-1"
                  onClick={handleSubscriptionUpdate}
                >
                  Update
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminOrganisers;
