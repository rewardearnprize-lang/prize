// src/pages/hamas.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Hamas = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const prizeId = params.get("prizeId");
  const prizeName = params.get("prizeName") || "";
  const emailParam = params.get("email");

  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const drawsData = JSON.parse(localStorage.getItem("drawsData") || "{}");

      if (prizeId) {
        // لو السحب مش موجود نعمله
        if (!drawsData[prizeId]) {
          drawsData[prizeId] = {
            participants: [],
            prizeName,
            maxParticipants: 100, // default
          };
        }

        const finalEmail =
          emailParam || localStorage.getItem("currentUserEmail") || "";

        if (
          finalEmail &&
          !drawsData[prizeId].participants.includes(finalEmail)
        ) {
          // نزود المشارك
          drawsData[prizeId].participants.push(finalEmail);

          // قلل العدد المتبقي
          if (drawsData[prizeId].maxParticipants > 0) {
            drawsData[prizeId].maxParticipants -= 1;
          }
        }

        // احفظ البيانات
        localStorage.setItem("drawsData", JSON.stringify(drawsData));
        localStorage.setItem("currentUserEmail", finalEmail);

        setConfirmed(true);

        toast({
          title: "تم التسجيل",
          description: "تم تأكيد مشاركتك بنجاح 🎉",
        });

        // رجّعه للصفحة الرئيسية مع كل البيانات
        setTimeout(() => {
          navigate(
            `/?success=true&prizeId=${prizeId}&prizeName=${encodeURIComponent(
              prizeName
            )}&email=${finalEmail}`
          );
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "خطأ",
        description: "حدثت مشكلة أثناء التسجيل",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ ينفذ تلقائي أول ما يدخل
  useEffect(() => {
    if (!confirmed && prizeId && emailParam) {
      handleConfirm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prizeId, emailParam]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 text-center text-white">
        <CardHeader>
          <CardTitle>تأكيد المشاركة</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-6">
            {emailParam ? (
              <>
                يتم الآن تأكيد مشاركتك باستخدام البريد:{" "}
                <b>{emailParam}</b> في السحب <b>{prizeName}</b>...
              </>
            ) : (
              "جاري التأكيد..."
            )}
          </p>

          {/* زر احتياطي لو الأوتوماتيك فشل */}
          <Button
            onClick={handleConfirm}
            disabled={loading || confirmed}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
          >
            {loading
              ? "جاري الحفظ..."
              : confirmed
              ? "✅ تم التأكيد"
              : "تأكيد يدوي"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Hamas;
