import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ---------- PASSWORD VALIDATOR ---------- */
const isStrongPassword = (password) => {
  const length = password.length >= 8;
  const upper = /[A-Z]/.test(password);
  const lower = /[a-z]/.test(password);
  const number = /[0-9]/.test(password);
  const special = /[^A-Za-z0-9]/.test(password);

  return { length, upper, lower, number, special };
};

const ChangePassword = () => {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  /* password rules */
  const [rules, setRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false,
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !currentPassword || !password || !confirmPassword) {
      toast({
        title: "Missing fields",
        description: "Please fill all fields.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    const allValid = Object.values(rules).every(Boolean);
    if (!allValid) {
      toast({
        title: "Weak password",
        description: "Password does not meet requirements.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:2511/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword: password,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setIsSuccess(true);
      toast({
        title: "Password Changed",
        description: "Your password was updated successfully.",
      });

      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
            <Calendar className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold text-foreground">
            Event<span className="text-primary">Mitra</span>
          </span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">
              {isSuccess ? "Password Changed!" : "Change Password"}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? "Your password has been updated successfully."
                : "Enter your current and new password."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isSuccess ? (
              <div className="text-center space-y-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to profile...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setRules(isStrongPassword(e.target.value));
                      }}
                      className="pl-11 pr-11 h-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>

                  {/* password rules */}
                  <div className="text-sm space-y-1">
                    <p className={rules.length ? "text-green-500" : "text-muted-foreground"}>• 8 characters</p>
                    <p className={rules.upper ? "text-green-500" : "text-muted-foreground"}>• Uppercase</p>
                    <p className={rules.lower ? "text-green-500" : "text-muted-foreground"}>• Lowercase</p>
                    <p className={rules.number ? "text-green-500" : "text-muted-foreground"}>• Number</p>
                    <p className={rules.special ? "text-green-500" : "text-muted-foreground"}>• Special character</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Change Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword;
