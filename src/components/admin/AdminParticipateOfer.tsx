import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface Participant {
  id: string;
  email?: string;
  userId?: string;
  offerId: string;
  offerTitle: string;
  status: string;
  verified?: boolean;
  timestamp?: Timestamp;
}

const AdminParticipateOffer = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const participantsRef = collection(firestore, "participants");
    const q = query(participantsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Participant[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data() as any;
        return {
          id: docSnap.id,
          email: d.email,
          userId: d.id,
          offerId: d.offerId,
          offerTitle: d.offerTitle, // 👈 هنا بجيب الاسم
          status: d.status,
          verified: d.verified || false,
          timestamp: d.timestamp,
        };
      });
      setParticipants(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteParticipant = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المشترك؟")) return;
    await deleteDoc(doc(firestore, "participants", id));
  };

  if (loading) {
    return <p className="text-white text-center py-10">جارِ التحميل...</p>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold text-white mb-8">مشاركات العروض</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {participants.map((p) => (
          <Card
            key={p.id}
            className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                {p.offerTitle}
                {p.verified && <CheckCircle className="w-5 h-5 text-green-400" />}
              </CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                {p.status === "completed" ? "مكتمل" : p.status}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              {p.email ? (
                <p>
                  <strong>البريد الإلكتروني:</strong> {p.email}
                </p>
              ) : (
                <p>
                  <strong>الـ ID:</strong> {p.userId}
                </p>
              )}

              <p>
                <strong>العرض:</strong> {p.offerTitle}
              </p>

              <p>
                <strong>التاريخ:</strong>{" "}
                {p.timestamp?.toDate().toLocaleString("ar-EG") || "-"}
              </p>
              <Button
                onClick={() => deleteParticipant(p.id)}
                className="bg-red-600 hover:bg-red-700 mt-2 w-full"
              >
                حذف المشترك
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-white mt-6">عدد المشاركات: {participants.length}</p>
    </div>
  );
};

export default AdminParticipateOffer;
