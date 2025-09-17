import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { firestore } from "@/lib/firebase";
import { collection, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { CheckCircle } from "lucide-react";

interface Participation {
  id: string;
  email: string;
  prize: string;
  status: "pending" | "accepted" | "rejected";
  joinDate: string;
  verified?: boolean; 
}

const AdminParticipationList = () => {
  const [participations, setParticipations] = useState<Participation[]>([]);

const fetchParticipations = async () => {
  const snap = await getDocs(collection(firestore, "participants"));
  const data = snap.docs
    .map((docSnap) => ({
      id: docSnap.id,
      ...(docSnap.data() as Participation),
    }))
    .filter((p) => p.prize && p.email);

  setParticipations(data);
};


  useEffect(() => {
    fetchParticipations();
  }, []);

  const updateStatus = async (id: string, status: "pending" | "accepted" | "rejected") => {
    await updateDoc(doc(firestore, "participants", id), { status });
    fetchParticipations();
  };

  const deleteParticipation = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشترك؟")) return;
    await deleteDoc(doc(firestore, "participants", id));
    fetchParticipations();
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">إدارة المشاركات</CardTitle>
      </CardHeader>
      <CardContent>
        {participations.length === 0 ? (
          <p className="text-gray-300">لا توجد مشاركات حتى الآن.</p>
        ) : (
          <div className="space-y-4">
            {participations.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
              >
                <div className="flex items-center gap-2">
                  {p.verified && <CheckCircle className="w-5 h-5 text-green-400" />}
                  <div>
                    <p className="text-white font-medium">{p.prize}</p>
                    <p className="text-gray-400 text-sm">{p.email}</p>
                    <p className="text-gray-500 text-xs">{p.joinDate}</p>
                    <p className="text-xs text-yellow-300">الحالة: {p.status}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => updateStatus(p.id, "accepted")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    قبول
                  </Button>
                  <Button
                    onClick={() => updateStatus(p.id, "rejected")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    رفض
                  </Button>
                  <Button
                    onClick={() => updateStatus(p.id, "pending")}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    معلق
                  </Button>
                  <Button
                    onClick={() => deleteParticipation(p.id)}
                    className="bg-gray-600 hover:bg-gray-700"
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminParticipationList;
