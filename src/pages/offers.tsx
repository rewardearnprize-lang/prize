import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { firestore } from "@/lib/firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { CheckCircle, XCircle, Trophy, Gift, Sparkles } from "lucide-react";

const OffersPage = () => {
  const [email, setEmail] = useState("");
  const [prizes, setPrizes] = useState<string[]>([]);
  const [selectedPrize, setSelectedPrize] = useState("");
  const [status, setStatus] = useState<"idle" | "found" | "notfound">("idle");
  const [loading, setLoading] = useState(false);

  // 🟣 Fetch all prizes
  useEffect(() => {
    const fetchPrizes = async () => {
      const snap = await getDocs(collection(firestore, "participants"));
      const prizeList = snap.docs.map((doc) => doc.data().prize as string);
      setPrizes([...new Set(prizeList)]);
    };
    fetchPrizes();
  }, []);

  const checkParticipation = async () => {
    if (!email || !selectedPrize) return;
    setLoading(true);
    setStatus("idle");

    try {
      const q = query(
        collection(firestore, "participants"),
        where("email", "==", email),
        where("prize", "==", selectedPrize)
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const participantDoc = snap.docs[0];
        await updateDoc(doc(firestore, "participants", participantDoc.id), {
          verified: true,
        });
        setStatus("found");
      } else {
        setStatus("notfound");
      }
    } catch (err) {
      console.error("Error checking participation:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Header Section */}
      <div className="absolute top-12 text-center w-full space-y-3 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white flex items-center justify-center gap-3">
          <Trophy className="w-10 h-10 text-yellow-400" />
          Congratulations on completing the draw 🎉
        </h1>
        <p className="text-lg text-gray-300 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-pink-400" />
          Enter here to finalize your entry
        </p>
      </div>

      {/* Main Card */}
      <Card className="max-w-md w-full mx-auto bg-white/10 border-white/20 backdrop-blur-md rounded-2xl shadow-2xl mt-40">
        <CardHeader>
          <CardTitle className="text-white text-xl text-center flex items-center justify-center gap-2">
            <Gift className="w-6 h-6 text-pink-400" />
            Verify Your Participation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Input Email */}
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
          />

          {/* Select Prize */}
          <select
            value={selectedPrize}
            onChange={(e) => setSelectedPrize(e.target.value)}
            className="w-full p-3 rounded-lg bg-white/20 text-black border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="">-- Select your prize --</option>
            {prizes.map((prize, i) => (
              <option key={i} value={prize} className="text-black">
                {prize}
              </option>
            ))}
          </select>

          {/* Check Button */}
          <Button
            onClick={checkParticipation}
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2 rounded-lg"
          >
            {loading ? "Checking..." : "Verify Now"}
          </Button>

          {/* Status Messages */}
          {status === "found" && (
            <div className="flex items-center justify-center text-green-400 mt-4 animate-bounce">
              <CheckCircle className="w-6 h-6 mr-2" />
              <span>Email & Prize verified 🎉</span>
            </div>
          )}

          {status === "notfound" && (
            <div className="flex items-center justify-center text-red-400 mt-4 animate-shake">
              <XCircle className="w-6 h-6 mr-2" />
              <span>No match found for this email & prize</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersPage;
