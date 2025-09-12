
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const VerificationNote = () => {
  return (
    <Card className="bg-blue-500/20 border-blue-500/30">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <CheckCircle className="w-6 h-6 text-blue-400 mt-1" />
          <div>
            <h4 className="text-white font-medium mb-1">التحقق التلقائي من الانضمام</h4>
            <p className="text-gray-300 text-sm">
              يتم التحقق من انضمامك تلقائياً خلال 24 ساعة. ستتلقى إشعاراً بإضافة السحوبات الإضافية لحسابك.
              للحصول على تأكيد فوري، تأكد من تفعيل الإشعارات في قناة Telegram.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VerificationNote;
