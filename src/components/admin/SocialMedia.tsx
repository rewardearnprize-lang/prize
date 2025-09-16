import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { firestore } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

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

const SocialMediaAdmin = () => {
  const [links, setLinks] = useState<SocialLinks>(defaultLinks);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const docRef = doc(firestore, "adminData", "socialLinks");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLinks(docSnap.data() as SocialLinks);
        }
      } catch (err) {
        console.error("Failed to fetch social links:", err);
        toast({
          title: "خطأ",
          description: "فشل في جلب الروابط الاجتماعية",
          variant: "destructive",
        });
      }
    };

    fetchLinks();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinks({ ...links, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const docRef = doc(firestore, "adminData", "socialLinks");
      await setDoc(docRef, links);
      toast({
        title: "تم الحفظ",
        description: "تم تحديث روابط القنوات الاجتماعية بنجاح",
      });
    } catch (err) {
      console.error("Failed to save social links:", err);
      toast({
        title: "خطأ",
        description: "فشل في حفظ الروابط الاجتماعية",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-12 space-y-6 px-4">
      <Card className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 shadow-2xl rounded-2xl transition-all duration-300 hover:scale-[1.01] hover:shadow-purple-500/20">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-md">
            إدارة الروابط الاجتماعية
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold text-gray-200">رابط قناة Telegram</label>
            <Input
              name="telegram"
              value={links.telegram}
              onChange={handleChange}
              placeholder="https://t.me/your_channel"
              className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 rounded-lg transition-all"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-200">رابط صفحة Facebook</label>
            <Input
              name="facebook"
              value={links.facebook}
              onChange={handleChange}
              placeholder="https://facebook.com/your_page"
              className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 rounded-lg transition-all"
            />
          </div>

          <div>
            <label className="block mb-2 font-semibold text-gray-200">رابط Instagram / TikTok</label>
            <Input
              name="instagram"
              value={links.instagram}
              onChange={handleChange}
              placeholder="https://instagram.com/your_account"
              className="bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-pink-500 rounded-lg transition-all"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full py-3 mt-6 bg-gradient-to-r from-purple-500 to-blue-600 hover:opacity-90 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105"
            disabled={loading}
          >
            {loading ? "جارٍ الحفظ..." : "حفظ الروابط"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SocialMediaAdmin;
