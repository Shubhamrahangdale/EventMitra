import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";
import { AuthProvider } from "@/context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import ScrollToTop from "@/components/ui/ScrollToTop";
import Profile from "./pages/Profile";
import BookingForm from "./pages/BookingForm";
import BookingConfirmation from "./pages/BookingConfirmation"
const App = () => (
   <AuthProvider>
  <TooltipProvider>
    <Toaster />
    <BrowserRouter>
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
        <Route path="*" element={<NotFound />} />
        <Route path="/profile" element={<Profile />} />
         <Route path="/events/:id/book" element={<BookingForm />} />
          <Route path="/booking/confirmation" element={<BookingConfirmation />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
  </AuthProvider>
);

export default App;
