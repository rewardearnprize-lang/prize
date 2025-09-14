// src/components/UserParticipationStatus.tsx
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface UserParticipation {
  email: string;
  prize: string;
  status: "completed" | "pending" | "failed";
  timestamp: string;
}

const UserParticipationStatus = () => {
  const { t } = useTranslation();
  const [userParticipations, setUserParticipations] = useState<UserParticipation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("userParticipations");
    const currentUserEmail = localStorage.getItem("currentUserEmail");

    if (stored && currentUserEmail) {
      const participations: UserParticipation[] = JSON.parse(stored);
      setUserParticipations(
        participations.filter((p) => p.email === currentUserEmail)
      );
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case "failed":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return t("participation.qualified") || "✅ مؤهل";
      case "pending":
        return t("participation.pending") || "⏳ قيد الانتظار";
      case "failed":
        return t("participation.failed") || "❌ مرفوض";
      default:
        return "غير معروف";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (userParticipations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">
          {t("participation.yourStatus") || "حالة مشاركتك"}
        </h3>

        <div className="space-y-3">
          {userParticipations.map((p, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-white/5 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(p.status)}
                <div>
                  <p className="text-white font-medium">{p.prize}</p>
                  <p className="text-gray-400 text-sm">{p.email}</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(p.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
              <Badge className={getStatusColor(p.status)}>
                {getStatusText(p.status)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserParticipationStatus;
