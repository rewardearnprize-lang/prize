
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

const NextDrawCountdown = () => {
  return (
    <Card className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
      <CardContent className="p-6 text-center">
        <Clock className="w-12 h-12 text-yellow-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-white mb-2">السحب القادم خلال</h3>
        <div className="text-3xl font-bold text-yellow-400 mb-2">3 أيام و 14 ساعة</div>
        <p className="text-gray-300">لا تفوت فرصتك! انضم لقنواتنا للحصول على إشعار فوري عند إعلان النتائج</p>
      </CardContent>
    </Card>
  );
};

export default NextDrawCountdown;
