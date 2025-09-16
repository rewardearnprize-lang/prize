import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, Star, Sparkles, Trophy, Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchOffers } from "@/store/slices/offersSlice";

const OfferCompletion = () => {
  const [identifier, setIdentifier] = useState(""); // Email or ID
  const [offerId, setOfferId] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { offers } = useAppSelector((state) => state.offers);

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => setShowSparkles(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !offerId) {
      setMessage("Please enter your Email / ID and select an offer");
      setMessageType("error");
      return;
    }

    setIsLoading(true);
    try {
      const docId = identifier + "_" + offerId;
      const participantRef = doc(firestore, "participants", docId);
      const snap = await getDoc(participantRef);

      if (!snap.exists()) {
        setMessage("No data found. Make sure you are registered for this offer.");
        setMessageType("error");
      } else {
        await updateDoc(participantRef, { verified: true });
        setMessage("🎉 Congratulations! Your entry has been confirmed successfully.");
        setMessageType("success");

        setTimeout(() => {
          navigate("/thank-you");
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during verification");
      setMessageType("error");
    }
    setIsLoading(false);
  };

  const sparkleElements = Array.from({ length: 6 }, (_, i) => (
    <div
      key={i}
      className={`absolute animate-sparkle ${showSparkles ? "opacity-100" : "opacity-0"}`}
      style={{
        left: `${20 + i * 15}%`,
        top: `${10 + (i % 2) * 20}%`,
        animationDelay: `${i * 0.2}s`,
        animationDuration: "2s",
      }}
    >
      <Star className="w-4 h-4 text-yellow-400 fill-current" />
    </div>
  ));

  return (
    <div className="min-h-screen bg-gradient-main flex items-center justify-center p-4 relative overflow-hidden">
      {sparkleElements}
      <div className="w-full max-w-lg">
        <Card className="bg-card-dark border-white/20 relative">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="mx-auto w-20 h-20 bg-yellow-500/20 rounded-full flex items-center justify-center animate-bounce-gentle">
              <Trophy className="w-10 h-10 text-yellow-400" />
            </div>
            <div className="space-y-3 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">🎉 Congratulations!</h1>
              <h2 className="text-xl md:text-2xl font-semibold text-white/90">You have completed the offer</h2>
            </div>
            <div className="animate-scale-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-lg text-green-300 font-medium flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                You are now eligible for the draw!
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="identifier" className="text-white font-medium flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Email or ID
                </Label>
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Enter your Email or ID"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="offer" className="text-white font-medium">
                  Select Offer
                </Label>
                <select
                  id="offer"
                  value={offerId}
                  onChange={(e) => setOfferId(e.target.value)}
                  className="w-full bg-white/10 border-white/20 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                >
                  <option value="">-- Select an Offer --</option>
                  {offers.map((offer) => (
                    <option key={offer.id} value={offer.id} className="bg-gray-900 text-white">
                      {offer.title}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
                {isLoading ? "Verifying..." : "Confirm Entry"}
              </Button>
            </form>

            {message && (
              <Alert
                className={`animate-fade-in ${
                  messageType === "success"
                    ? "bg-green-500/20 border-green-500/30 text-green-300"
                    : "bg-red-500/20 border-red-500/30 text-red-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {messageType === "success" ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <AlertDescription className="text-sm leading-relaxed">{message}</AlertDescription>
                </div>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfferCompletion;
