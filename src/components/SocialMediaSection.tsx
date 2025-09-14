import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Users } from "lucide-react";
import { firestore } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";

interface SocialLinks {
  telegram: string;
  facebook: string;
  instagram: string;
}

const defaultLinks: SocialLinks = {
  telegram: "",
  facebook: "",
  instagram: "",
};

const SocialMediaSection = () => {
  const [links, setLinks] = useState<SocialLinks>(defaultLinks);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const docRef = doc(firestore, "adminData", "socialLinks");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLinks(docSnap.data() as SocialLinks);
        } else {
          toast({
            title: "Notice",
            description: "Social links have not been set up by the admin yet.",
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Failed to fetch social links:", err);
        toast({
          title: "Error",
          description: "Failed to fetch social links.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [toast]);

  const socialPlatforms = [
    {
      id: "telegram",
      name: "Telegram",
      icon: "📱",
      color: "from-blue-500 to-blue-600",
      url: links.telegram,
      followers: "12.5K",
      description: "Follow Telegram channel",
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "👥",
      color: "from-blue-600 to-blue-700",
      url: links.facebook,
      followers: "8.3K",
      description: "Follow Facebook page",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📸",
      color: "from-pink-500 to-purple-600",
      url: links.instagram,
      followers: "25.1K",
      description: "Follow Instagram ",
    },
  ];

  const handleSocialClick = (platform: any) => {
    if (!platform.url) {
      toast({
        title: "Unavailable",
        description: "This link has not been set up yet.",
        variant: "destructive",
      });
      return;
    }
    window.open(platform.url, "_blank");
  };

  if (loading)
    return <p className="text-center text-white mt-10">Loading links...</p>;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">Follow Us on Social Media</h2>
        <p className="text-xl text-gray-300">
          Stay updated with the latest news and exclusive offers through our official channels
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {socialPlatforms.map((platform) => (
          <Card
            key={platform.id}
            className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105"
          >
            <CardContent className="p-6 text-center space-y-4">
              <div
                className={`w-16 h-16 bg-gradient-to-r ${platform.color} rounded-full flex items-center justify-center mx-auto text-2xl`}
              >
                {platform.icon}
              </div>

              <h3 className="text-xl font-bold text-white">{platform.name}</h3>

              <div className="flex items-center justify-center space-x-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400 text-sm">{platform.followers} followers</span>
              </div>

              <Button
                onClick={() => handleSocialClick(platform)}
                className={`w-full bg-gradient-to-r ${platform.color} hover:opacity-90`}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                {platform.description}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialMediaSection;
