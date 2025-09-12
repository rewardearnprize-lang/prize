
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, CheckCircle, Users } from "lucide-react";

interface SocialPlatform {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  url: string;
  benefit: string;
  followers: string;
  priority: number;
}

interface SocialPlatformCardProps {
  platform: SocialPlatform;
  isCompleted: boolean;
  onPlatformClick: (platform: SocialPlatform) => void;
}

const SocialPlatformCard = ({ platform, isCompleted, onPlatformClick }: SocialPlatformCardProps) => {
  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 relative">
      {platform.priority === 1 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
          الأهم
        </div>
      )}
      
      <CardContent className="p-6 space-y-4">
        <div className="text-center">
          <div className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center mx-auto mb-3 text-2xl`}>
            {platform.icon}
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">{platform.name}</h3>
          <p className="text-gray-300 text-sm mb-3">{platform.description}</p>
          
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">{platform.followers} متابع</span>
          </div>
          
          <Badge className="bg-green-500/20 text-green-400 mb-4">
            🎁 {platform.benefit}
          </Badge>
        </div>
        
        <Button 
          onClick={() => onPlatformClick(platform)}
          className={`w-full ${isCompleted 
            ? 'bg-green-500 hover:bg-green-600' 
            : `bg-gradient-to-r ${platform.color} hover:opacity-90`
          }`}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              تم الانضمام ✓
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              انضم الآن ({platform.priority === 1 ? '+2' : '+1'} سحب)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default SocialPlatformCard;
