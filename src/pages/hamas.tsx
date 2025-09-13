import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

const Hamas = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const prizeId = params.get("prizeId");
  const prizeName = params.get("prizeName");
  const email = params.get("email");

  const [loading, setLoading] = useState(false);

  const handleComplete = () => {
    setLoading(true);

    // 🟢 خلي الـ redirect للصفحة الرئيسية باستخدام navigate عشان ميديكش 404
    navigate(
      `/?success=true&prizeId=${prizeId}&prizeName=${encodeURIComponent(
        prizeName || ""
      )}&email=${encodeURIComponent(email || "")}`
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="text-center">
        <h1 className="text-3xl md:text-5xl text-white font-bold mb-8">
          مرحباً 🎉 {email}
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          أنت على بعد خطوة واحدة من إكمال مشاركتك في السحب:{" "}
          <span className="font-bold text-yellow-400">{prizeName}</span>
        </p>
        <Button
          onClick={handleComplete}
          disabled={loading}
          className="text-xl px-12 py-6 rounded-2xl bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
        >
          {loading ? "جاري المعالجة..." : "✅ أكمل السحب الآن"}
        </Button>
      </div>
    </div>
  );
};

export default Hamas;
