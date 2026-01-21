import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ScrollToTop from "@/components/ui/ScrollToTop";
import { loadTheme } from "@/components/ui/theme";

// pages
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import Profile from "./pages/Profile";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";

// Admin
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminOrganisers from "@/pages/admin/AdminOrganisers";
import AdminEvents from "@/pages/admin/AdminEvents";
import AdminTransactions from "@/pages/admin/AdminTransactions.jsx"
import AdminSettings from "@/pages/admin/AdminSettings";
import ProtectedRoute from "@/pages/admin/ProtectedRoute";
import { AdminProvider } from "@/context/AdminContext";
import { OrganiserProvider } from "@/context/OrganiserContext";
import { EventProvider } from "@/context/EventContext";
import RegisterSuccess from "@/pages/RegisterSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ChangePassword from "./pages/ChangePassword";
import TermsNCondition from "./pages/TermsNCondition";



const App = () => {
  useEffect(() => {
    loadTheme();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AdminProvider>
          <OrganiserProvider>
            <EventProvider>
              <TooltipProvider>
                <Toaster />
                <ScrollToTop />

                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/events/:id" element={<EventDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/organizer" element={<OrganizerDashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/events/:id/book" element={<BookingForm />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                  <Route path="/terms" element={<TermsNCondition />} />
<Route path="/reset-password" element={<ResetPassword />} />

                  <Route
                    path="/booking/confirmation"
                    element={<BookingConfirmation />}
                  />

                  {/* ADMIN */}
                  <Route path="/admin" element={<AdminLogin />} />

                  <Route
                    path="/admin/dashboard"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/organisers"
                    element={
                      <ProtectedRoute>
                        <AdminOrganisers />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/events"
                    element={
                      <ProtectedRoute>
                        <AdminEvents />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/transactions"
                    element={
                      <ProtectedRoute>
                        <AdminTransactions />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin/settings"
                    element={
                      <ProtectedRoute>
                        <AdminSettings />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/register-success" element={<RegisterSuccess />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </EventProvider>
          </OrganiserProvider>
        </AdminProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};


export default App;
