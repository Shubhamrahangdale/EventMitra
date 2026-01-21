import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

import { sendOtp, verifyOtp } from "@/lib/utils";

const checkPasswordRules = (password) => {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#]/.test(password),
  };
};

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState("attendee");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [rules, setRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });


  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const emailRegex = /^(?!\.)(?!.*\.\.)[A-Za-z0-9._+\-$]+(?<!\.)@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;

    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email ❌",
        description: "Check your mail ✉️🔎",
        variant: "destructive",
      });
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Mobile Number ❌",
        description: "Mobile number must be exactly 10 digits",
        variant: "destructive",
      });
      return false;
    }

    if (!passwordRegex.test(formData.password)) {
      toast({
        title: "Weak Password ❌",
        description:
          "Password must be 8+ characters with uppercase, lowercase, number & special character",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.name || !formData.email || !formData.password) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    const allValid = Object.values(rules).every(Boolean);
    if (!allValid) {
      toast({
        title: "Weak Password ❌",
        description: "Password does not meet security rules",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please agree to the Terms of Service and Privacy Policy.",
        variant: "destructive",
      });
      return;
    }
    if (!otpVerified) {
      toast({
        title: "Email not verified ❌",
        description: "Please verify email using OTP",
        variant: "destructive",
      });
      return;
    }


    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:2511/api/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            role: userType,
          }),
        }
      );



      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Account Created 🎉",
          description: "Your account has been successfully created!",
        });
        if (userType === "organizer") {
          // organiser will not go ti loginpage it will go successpage 
          window.location.href = "/register-success";
        } else {
          // attendee ko login allow
          window.location.href = "/login";
        }


      } else {
        toast({
          title: "Registration Failed ❌",
          description: result.message || "Something went wrong.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Server Error ❌",
        description: "Unable to connect to server. Check backend.",
        variant: "destructive",
      });
      console.log(error);
    }

    setIsLoading(false);
  };

  //-------------------------------------------2----------------------------------
  const handleSendOtp = async () => {
    if (!formData.email) {
      toast({ title: "Enter email first ❌", variant: "destructive" });
      return;
    }

    try {
      const res = await sendOtp(formData.email);
      if (res.success) {
        toast({ title: "OTP sent to email 📩" });
        setOtpSent(true);
      } else {
        toast({ title: "OTP failed ❌", description: res.message, variant: "destructive" });
      }
    } catch {
      toast({ title: "Server error ❌", variant: "destructive" });
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast({ title: "Enter OTP ❌", variant: "destructive" });
      return;
    }

    try {
      const res = await verifyOtp(formData.email, otp);
      if (res.success) {
        toast({ title: "Email verified ✅" });
        setOtpVerified(true);
      } else {
        toast({ title: "Invalid OTP ❌", variant: "destructive" });
      }
    } catch {
      toast({ title: "Server error ❌", variant: "destructive" });
    }
  };

  //-------------------------------------------2----------------------------------

  const features = [
    "Create and manage unlimited events",
    "Access to analytics dashboard",
    "Email & SMS notifications",
    "Secure payment processing",
    "24/7 customer support",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
              Create Account
            </h1>
            <p className="text-muted-foreground">
              Join EventMitra and start organizing amazing events
            </p>
          </div>

          {/* User Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType("attendee")}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                userType === "attendee"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-semibold text-foreground mb-1">Attendee</div>
              <p className="text-sm text-muted-foreground">Discover & attend events</p>
            </button>
            <button
              type="button"
              onClick={() => setUserType("organizer")}
              className={cn(
                "p-4 rounded-xl border-2 text-left transition-all",
                userType === "organizer"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="font-semibold text-foreground mb-1">Organizer</div>
              <p className="text-sm text-muted-foreground">Create & manage events</p>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                  className="pl-11 h-12"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-11 h-12"
                  required
                />
              </div>
            </div>
            {/* //-------------------------------------------3----------------------------------
  //----------------------------------------------------------------------------- */}
            {!otpSent && (
              <Button type="button" variant="outline" onClick={handleSendOtp} className="w-full">
                Send OTP
              </Button>
            )}

            {otpSent && !otpVerified && (
              <div className="space-y-2">
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <Button type="button" onClick={handleVerifyOtp} className="w-full">
                  Verify OTP
                </Button>
              </div>
            )}

            {otpVerified && (
              <p className="text-green-600 text-sm font-medium">✅ Email verified</p>
            )}

            {/* //-------------------------------------------3----------------------------------
  //----------------------------------------------------------------------------- */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="pl-11 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => {
                    handleChange(e);
                    setRules(checkPasswordRules(e.target.value));
                  }}
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
              <p className="text-xs text-muted-foreground mt-2">
                Password must contain:
              </p>
              <ul className="text-xs list-disc list-inside space-y-1">
                <li className={rules.length ? "text-green-500" : "text-muted-foreground"}>
                  Minimum 8 characters
                </li>
                <li className={rules.upper ? "text-green-500" : "text-muted-foreground"}>
                  One uppercase letter (A–Z)
                </li>
                <li className={rules.lower ? "text-green-500" : "text-muted-foreground"}>
                  One lowercase letter (a–z)
                </li>
                <li className={rules.number ? "text-green-500" : "text-muted-foreground"}>
                  One number (0–9)
                </li>
                <li className={rules.special ? "text-green-500" : "text-muted-foreground"}>
                  One special character (@$!%*?&#)
                </li>
              </ul>

            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="pl-11 h-12"
                  required
                />
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/terms" className="text-primary hover:underline">Privacy Policy</Link>

              </label>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Features */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0 pattern-overlay" />
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-primary-foreground max-w-md">
            <h2 className="font-display text-4xl font-bold mb-6">
              Everything You Need to Host Amazing Events
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8">
              Join 500+ event organizers who trust EventMitra for their events across India.
            </p>
            <ul className="space-y-4">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-accent" />
                  <span className="text-primary-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
