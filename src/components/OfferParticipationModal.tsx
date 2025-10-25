import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Star, Sparkles, Trophy, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OfferCompletion = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger sparkle animation on page load
    const timer = setTimeout(() => {
      setShowSparkles(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage("Please enter a valid email address");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    
    // Simulate confirmation process
    setTimeout(() => {
      setMessage("Congratulations! Your entry has been confirmed. You're now in the draw!");
      setMessageType("success");
      setIsLoading(false);
      
      // Redirect to thank you page after 3 seconds
      setTimeout(() => {
        navigate("/thank-you");
      }, 3000);
    }, 1500);
  };

  const sparkleElements = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`absolute animate-sparkle ${showSparkles ? 'opacity-100' : 'opacity-0'}`}
      style={{
        left: `${20 + i * 15}%`,
        top: `${10 + (i % 2) * 20}%`,
        animationDelay: `${i * 0.2}s`,
        animationDuration: '2s'
      }}
    >
      <Star className="w-4 h-4 text-yellow-400 fill-current" />
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4 relative overflow-hidden">
      {/* Sparkle Elements */}
      {sparkleElements}
      
      <div className="w-full max-w-lg">
        <Card className="bg-card-dark border-white/20 relative">
          <CardHeader className="text-center space-y-6 pb-8">
            {/* Trophy Icon with Animation */}
            <div className="mx-auto w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center animate-bounce-gentle">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            
            {/* Main Headline with Fade Animation */}
            <div className="space-y-3 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                ðŸŽ‰ Congratulations!
              </h1>
              <h2 className="text-xl md:text-2xl font-semibold text-white/90">
                You have completed the offer
              </h2>
            </div>
            
            {/* Subtext with Scale Animation */}
            <div className="animate-scale-in" style={{ animationDelay: '0.3s' }}>
              <p className="text-lg text-green-300 font-medium flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                You are now eligible for the draw!
              </p>
              <p className="text-gray-300 text-sm mt-2">
                Your entry has been recorded and you're in the running for amazing prizes
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-white font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Email Address (Optional)
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-white/40 transition-all duration-200 focus:bg-white/15"
                />
                <p className="text-xs text-gray-400">
                  Provide your email to receive updates about the draw results
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 text-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Confirming Entry...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Confirm My Entry
                  </div>
                )}
              </Button>
            </form>

            {message && (
              <Alert className={`animate-fade-in ${
                messageType === "success" 
                  ? "bg-green-500/20 border-green-500/30 text-green-300" 
                  : "bg-red-500/20 border-red-500/30 text-red-300"
              }`}>
                <div className="flex items-start space-x-3">
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <AlertDescription className="text-sm leading-relaxed">
                    {message}
                  </AlertDescription>
                </div>
              </Alert>
            )}

            <div className="text-center space-y-3 pt-4 border-t border-white/10">
              <p className="text-gray-400 text-sm">
                Want to increase your chances?
              </p>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200"
              >
                Complete More Offers
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Floating Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-yellow-400/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-green-400/20 rounded-full animate-bounce-gentle" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
};

export default OfferCompletion;
