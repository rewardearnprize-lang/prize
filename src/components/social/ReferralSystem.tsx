
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReferralSystem = () => {
  const [referralCode] = useState(() => `REF${Date.now().toString(36).toUpperCase()}`);
  const { toast } = useToast();

  const copyReferralCode = () => {
    navigator.clipboard.writeText(`https://yourdomain.com/?ref=${referralCode}`);
    toast({
      title: "تم نسخ رابط الإحالة! 📋",
      description: "شارك هذا الرابط مع أصدقائك واحصل على سحوبات إضافية",
    });
  };

  return (
    <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          <Gift className="w-6 h-6 inline mr-2" />
          نظام الإحالة - اربح سحوبات إضافية!
        </h3>
        
        <div className="bg-white/10 rounded-lg p-4 mb-4">
          <p className="text-gray-300 text-sm mb-3">رابط الإحالة الخاص بك:</p>
          <div className="flex items-center space-x-2">
            <input 
              type="text" 
              value={`https://yourdomain.com/?ref=${referralCode}`}
              readOnly 
              className="flex-1 bg-white/20 border border-white/30 rounded px-3 py-2 text-white text-sm"
            />
            <Button onClick={copyReferralCode} size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4 text-center">
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-green-400">+3</div>
            <div className="text-sm text-gray-300">سحوبات لكل صديق يشترك</div>
          </div>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="text-2xl font-bold text-blue-400">+1</div>
            <div className="text-sm text-gray-300">سحب إضافي لك أيضاً</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralSystem;
