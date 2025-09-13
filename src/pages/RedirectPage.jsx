import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const RedirectPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const prizeId = params.get("prizeId");
  const prizeName = params.get("prizeName");
  const email = params.get("email");

  const [loading, setLoading] = useState(false);

  const handleComplete = () => {
    setLoading(true);

    // 🔗 ده اللينك اللي هيرجعك للصفحة الرئيسية بتاعتك
    const redirectUrl = `https://prizeapp.netlify.app/?success=true&prizeId=${prizeId}&prizeName=${encodeURIComponent(
      prizeName || ""
    )}&email=${encodeURIComponent(email || "")}`;

    window.location.href = redirectUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl text-white font-bold mb-8">
          Welcome 🎉 {email}
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          You are one step away from completing your entry for:{" "}
          <span className="font-bold text-yellow-400">{prizeName}</span>
        </p>
        <Button
          onClick={handleComplete}
          disabled={loading}
          className="text-xl px-12 py-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        >
          {loading ? "Processing..." : "✅ Complete Entry Now"}
        </Button>
      </div>
    </div>
  );
};

export default RedirectPage;
