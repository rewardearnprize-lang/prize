
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface UserParticipation {
  email: string;
  prize: string;
  status: 'completed' | 'pending' | 'failed';
  timestamp: string;
}

const UserParticipationStatus = () => {
  const { t } = useTranslation();
  const [userParticipations, setUserParticipations] = useState<UserParticipation[]>([]);

  useEffect(() => {
    // In real implementation, fetch from Firebase/localStorage
    const stored = localStorage.getItem('userParticipations');
    if (stored) {
      setUserParticipations(JSON.parse(stored));
    }
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return t('participation.qualified');
      case 'pending':
        return t('participation.pending');
      case 'failed':
        return t('participation.failed');
      default:
        return 'غير معروف';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (userParticipations.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-8">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">{t('participation.yourStatus')}</h3>
        <div className="space-y-3">
          {userParticipations.map((participation, index) => (
            <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(participation.status)}
                <div>
                  <p className="text-white font-medium">{participation.prize}</p>
                  <p className="text-gray-400 text-sm">{participation.email}</p>
                </div>
              </div>
              <Badge className={getStatusColor(participation.status)}>
                {getStatusText(participation.status)}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserParticipationStatus;
