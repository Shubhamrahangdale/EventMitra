import { useState } from "react";
import { Link , useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";


const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  


const handleSubmit = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    toast({
      title: "Missing fields",
      description: "Please enter both email and password.",
      variant: "destructive",
    });
    return;
    
  }

  setIsLoading(true);

  try {
    const response = await fetch("http://localhost:2511/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    //  BLOCK organiser login if not approved
    if (!response.ok) {
      toast({
        title: "Login Failed ❌",
        description: result.message,
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

 
    // Save token
localStorage.setItem("token", result.token);
localStorage.setItem("role", result.user.role);
localStorage.setItem("userId", result.user._id);
  


// Update Auth Context (VERY IMPORTANT)
login({
  name: result.user.name,
  email: result.user.email,
  role: result.user.role,
  phone: result.user.phone || ""
});

const from = location.state?.from || "/";

navigate(from, { replace: true });

// Redirect
if (result.user.role === "attendee") {
  window.location.href = "/";
} else if (result.user.role === "organizer") {
  window.location.href = "/organizer";
}


  } catch (error) {
    toast({
      title: "Server Error ❌",
      description: "Backend not reachable.",
      variant: "destructive",
    });
    console.error(error);
  }

  setIsLoading(false);
  
};

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              Event<span className="text-primary">Mitra</span>
            </span>
          </Link>

          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Sign in to continue managing your events
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="password">Password</Label>
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11 pr-11 h-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign In"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-overlay" />
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center text-primary-foreground max-w-md">
            <h2 className="font-display text-4xl font-bold mb-6">
              Manage Events<br />Like Never Before
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join thousands of event organizers across India who trust EventMitra for creating memorable experiences.
            </p>
            <div className="flex justify-center gap-8">
              <div>
                <div className="font-display text-3xl font-bold">10K+</div>
                <div className="text-sm text-primary-foreground/60">Events Hosted</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold">50K+</div>
                <div className="text-sm text-primary-foreground/60">Happy Users</div>
              </div>
              <div>
                <div className="font-display text-3xl font-bold">25+</div>
                <div className="text-sm text-primary-foreground/60">Cities</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
