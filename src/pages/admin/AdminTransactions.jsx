import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, IndianRupee, Calendar, Users, TrendingUp, Download } from 'lucide-react';
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdmin } from '@/context/AdminContext';
import { useOrganisers } from '@/context/OrganiserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';


const AdminTransactions = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);



  useEffect(() => {
    if (!isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        const res = await fetch(
          "http://localhost:2511/api/subscriptions/admin/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to load transactions", err);
      }
    };

    fetchTransactions();
  }, []);


  const filteredTransactions = transactions.filter((txn) => {
    const organiserName = txn.organizerId?.name || "";
    const organiserEmail = txn.organizerId?.email || "";
    const txnId = txn._id || "";

    const matchesSearch =
      organiserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organiserEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txnId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || txn.status === statusFilter;

    const matchesPlan =
      planFilter === "all" || txn.plan === planFilter;

    return matchesSearch && matchesStatus && matchesPlan;
  });


  const stats = {
    totalRevenue: transactions.reduce((sum, t) => sum + t.amount, 0),
    activeSubscriptions: transactions.filter(t => t.status === 'success').length,
    expiredSubscriptions: transactions.filter(t => t.status === 'expired').length,
    totalTransactions: transactions.length,
  };

  const getStatusBadge = (status) => {
    if (status === "success" || status === "active") {
      return (
        <Badge className="bg-green-500/10 text-green-600 border border-green-500/20">
          Success
        </Badge>
      );
    }

    if (status === "failed") {
      return (
        <Badge className="bg-destructive/10 text-destructive border border-destructive/20">
          Failed
        </Badge>
      );
    }

    return (
      <Badge className="bg-muted text-muted-foreground border border-border">
        Pending
      </Badge>
    );
  };



  const getPlanBadge = (plan) => {
    if (plan === "enterprise") {
      return (
        <Badge className="bg-primary/10 text-primary border border-primary/20">
          Enterprise
        </Badge>
      );
    }

    if (plan === "pro") {
      return (
        <Badge className="bg-accent/10 text-accent border border-accent/20">
          Pro
        </Badge>
      );
    }

    return (
      <Badge className="bg-muted text-muted-foreground border border-border">
        Basic
      </Badge>
    );
  };


  if (!isAuthenticated) return null;

  return (
    <AdminLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-display font-bold text-foreground mb-2">Subscription Transactions</h1>
          <p className="text-muted-foreground">View all organiser subscription payments and plan details</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">₹{(stats.totalRevenue / 100000).toFixed(1)}L</p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.activeSubscriptions}</p>
                <p className="text-sm text-muted-foreground">Active Subscriptions</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.expiredSubscriptions}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalTransactions}</p>
                <p className="text-sm text-muted-foreground">Total Transactions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by organiser name, email or transaction ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Select value={planFilter} onValueChange={setPlanFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Plans</SelectItem>
                  <SelectItem value="basic">Basic (₹4,999)</SelectItem>
                  <SelectItem value="pro">Pro (₹9,999)</SelectItem>
                  <SelectItem value="enterprise">Unlimited (₹19,999)</SelectItem>

                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium">Transaction ID</th>
                    <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium">Organiser</th>
                    <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium">Plan</th>
                    <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium">Amount</th>
                    <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium">Events</th>
                    <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium">Status</th>
                    <th className="text-left py-4 px-4 text-sm text-muted-foreground font-medium">Expiry</th>
                    <th className="text-right py-4 px-4 text-sm text-muted-foreground font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((txn) => (
                    <tr key={txn._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-mono text-sm text-foreground">{txn._id}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {txn.organizerId?.name || "—"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {txn.organizerId?.email || "—"}
                          </p>
                        </div>
                      </td>


                      <td className="py-4 px-4">{getPlanBadge(txn.plan)}</td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-foreground">
                          ₹{txn.amount?.toLocaleString("en-IN") || "—"}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <p className="text-foreground">
                          {(txn.eventsUsed ?? 0)} /{" "}
                          {txn.eventsAllowed === 999
                            ? "∞"
                            : txn.eventsAllowed ?? 0}
                        </p>

                      </td>
                      <td className="py-4 px-4">{getStatusBadge(txn.status)}</td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-foreground">
                          {new Date(txn.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => { setSelectedTransaction(txn); setViewDialogOpen(true); }}
                        >
                          <Eye className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredTransactions.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No transactions found.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* View Transaction Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTransaction && (
              <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                  <div>
                    <p className="text-sm text-muted-foreground">Transaction ID</p>
                    <p className="font-mono font-semibold text-foreground">{selectedTransaction._id}</p>
                  </div>
                  {getStatusBadge(selectedTransaction.status)}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Organiser Information</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium text-foreground">{selectedTransaction.organizerId?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground"> {selectedTransaction.organizerId?.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground">Subscription Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Plan</p>
                      <p className="font-medium text-foreground">{selectedTransaction.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Amount</p>
                      <p className="font-medium text-foreground">₹{selectedTransaction.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Purchase Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedTransaction.purchaseDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Expiry Date</p>
                      <p className="font-medium text-foreground">
                        {new Date(selectedTransaction.expiryDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Method</p>
                      <p className="font-medium text-foreground">
                        {selectedTransaction.paymentMethod ||
                          selectedTransaction.provider ||
                          "Online"}
                      </p>

                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Events Usage</p>
                      <p className="font-medium text-foreground">
                        {(selectedTransaction.eventsUsed ?? 0)} /{" "}
                        {selectedTransaction.eventsAllowed === 999
                          ? "Unlimited"
                          : selectedTransaction.eventsAllowed ?? 0}

                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress bar for events */}
                {selectedTransaction.eventsAllowed !== 999 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Events Used</span>
                      <span className="text-foreground">
                        {(() => {
                          const used = selectedTransaction.eventsUsed || 0;
                          const allowed = selectedTransaction.eventsAllowed || 0;

                          if (allowed === 0 || allowed === 999) return "—";

                          return `${Math.round((used / allowed) * 100)}%`;
                        })()}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{
                          width:
                            selectedTransaction.eventsAllowed > 0 &&
                              selectedTransaction.eventsAllowed !== 999
                              ? `${(selectedTransaction.eventsUsed / selectedTransaction.eventsAllowed) * 100}%`
                              : "0%",
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;