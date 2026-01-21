// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar, Mail, ArrowLeft, CheckCircle } from "lucide-react";
// import { toast } from "@/hooks/use-toast";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [isEmailSent, setIsEmailSent] = useState(false);

//   const handleSubmit = async (e) => {
//   e.preventDefault();

//   setIsLoading(true);

//   try {
//     const res = await fetch("http://localhost:2511/api/auth/forgot-password", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email }),
//     });

//     const data = await res.json();

//     if (!res.ok) throw new Error(data.message);

//     setIsEmailSent(true);
//     toast({
//       title: "Email Sent",
//       description: "Password reset link sent to your email",
//     });

//   } catch (err) {
//     toast({
//       title: "Error",
//       description: err.message,
//       variant: "destructive",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };


//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background p-4">
//       <div className="w-full max-w-md">
//         {/* Logo */}
//         <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
//           <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-md">
//             <Calendar className="w-5 h-5 text-primary-foreground" />
//           </div>
//           <span className="font-display text-xl font-bold text-foreground">
//             Event<span className="text-primary">Mitra</span>
//           </span>
//         </Link>

//         <Card>
//           <CardHeader className="text-center">
//             <CardTitle className="font-display text-2xl">
//               {isEmailSent ? "Check Your Email" : "Forgot Password?"}
//             </CardTitle>
//             <CardDescription>
//               {isEmailSent 
//                 ? "We've sent a password reset link to your email address."
//                 : "No worries! Enter your email and we'll send you a reset link."
//               }
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {isEmailSent ? (
//               <div className="text-center space-y-6">
//                 <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
//                   <CheckCircle className="w-8 h-8 text-green-600" />
//                 </div>
//                 <div className="space-y-2">
//                   <p className="text-sm text-muted-foreground">
//                     We sent a reset link to:
//                   </p>
//                   <p className="font-medium text-foreground">{email}</p>
//                 </div>
//                 <div className="space-y-3">
//                   <p className="text-sm text-muted-foreground">
//                     Didn't receive the email? Check your spam folder or
//                   </p>
//                   <Button 
//                     variant="outline" 
//                     onClick={() => setIsEmailSent(false)}
//                     className="w-full"
//                   >
//                     Try another email
//                   </Button>
//                 </div>
//                 <Link 
//                   to="/login" 
//                   className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
//                 >
//                   <ArrowLeft className="w-4 h-4" />
//                   Back to login
//                 </Link>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email Address</Label>
//                   <div className="relative">
//                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
//                     <Input
//                       id="email"
//                       type="email"
//                       placeholder="you@example.com"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="pl-11 h-12"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
//                   {isLoading ? "Sending..." : "Send Reset Link"}
//                 </Button>

//                 <div className="text-center">
//                   <Link 
//                     to="/login" 
//                     className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
//                   >
//                     <ArrowLeft className="w-4 h-4" />
//                     Back to login
//                   </Link>
//                 </div>
//               </form>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1=email, 2=otp
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // STEP 1: SEND OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:2511/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "OTP Sent", description: "Check your email" });
      setStep(2);
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // STEP 2: VERIFY OTP
  const verifyOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:2511/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      toast({ title: "OTP Verified" });

      // pass email to reset page
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
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
              {step === 1 ? "Forgot Password?" : "Verify OTP"}
            </CardTitle>
            <CardDescription>
              {step === 1
                ? "Enter your email to receive OTP."
                : "Enter the OTP sent to your email."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 1 ? (
              <form onSubmit={sendOtp} className="space-y-5">
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={verifyOtp} className="space-y-5">
                <div className="space-y-2">
                  <Label>OTP</Label>
                  <Input value={otp} onChange={(e) => setOtp(e.target.value)} required />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-primary underline w-full text-center"
                >
                  Change email
                </button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
