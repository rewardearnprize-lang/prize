
import { Card, CardContent } from "@/components/ui/card";

interface BonusTrackerProps {
  completedActions: string[];
  totalPlatforms: number;
}

const BonusTracker = ({ completedActions, totalPlatforms }: BonusTrackerProps) => {
  if (completedActions.length === 0) return null;

  return (
    <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border-green-500/30">
      <CardContent className="p-6 text-center">
        <h3 className="text-xl font-bold text-white mb-2">مكافآتك المتراكمة</h3>
        <p className="text-green-400 text-3xl font-bold mb-2">
          +{completedActions.length + (completedActions.includes('telegram') ? 1 : 0)} سحب إضافي!
        </p>
        <p className="text-gray-300 text-sm mb-4">
          انضممت إلى {completedActions.length} من أصل {totalPlatforms} قناة
        </p>
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(completedActions.length / totalPlatforms) * 100}%` }}
          ></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BonusTracker;
