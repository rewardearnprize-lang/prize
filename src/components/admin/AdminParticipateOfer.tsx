import { useEffect, useState } from "react";
import { firestore } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query, Timestamp, deleteDoc, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Participant {
  id: string;
  email: string;
  offerId: string;
  offerTitle: string;
  status: string;
  timestamp: Timestamp;
}

const AdminParticipateOffer = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const participantsRef = collection(firestore, "participants");
    const q = query(participantsRef, orderBy("timestamp", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Participant[] = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<Participant, "id">),
      }));
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
          <Card key={p.id} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-white">{p.offerTitle}</CardTitle>
              <CardDescription className="text-gray-300 text-sm">
                {p.status === "completed" ? "مكتمل" : p.status}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-gray-300 text-sm space-y-2">
              <p><strong>البريد الإلكتروني:</strong> {p.email}</p>
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
