import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOffers,
  addOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus,
  type Offer,
} from "@/store/slices/offersSlice";

const OffersManagement = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { offers, loading, error } = useAppSelector((state) => state.offers);

  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: "",
    description: "",
    points: 0,
    category: "social",
    offerurl: "",
    iconText: "🎁", // الأيقونة كنص افتراضي
  });

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const normalizeUrl = (url: string) => {
    if (!url) return "";
    return /^https?:\/\//i.test(url) ? url : "https://" + url;
  };

  const handleAddOffer = async () => {
    if (!newOffer.title || !newOffer.description || !newOffer.offerurl) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    const finalLink = normalizeUrl(newOffer.offerurl);

    const result = await dispatch(
      addOffer({
        ...newOffer,
        offerurl: finalLink,
        status: "active",
        imageUrl: ""
      })
    );

    if (addOffer.fulfilled.match(result)) {
      setNewOffer({
        title: "",
        description: "",
        points: 0,
        category: "social",
        offerurl: "",
        iconText: "🎁",
      });
      setShowAddDialog(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة العرض الجديد",
      });
    }
  };

  const handleEditOfferSave = async () => {
    if (!editingOffer) return;

    const finalLink = normalizeUrl(editingOffer.offerurl || "");

    const result = await dispatch(
      updateOffer({
        id: editingOffer.id,
        offerData: { ...editingOffer, offerurl: finalLink },
      })
    );

    if (updateOffer.fulfilled.match(result)) {
      setShowEditDialog(false);
      setEditingOffer(null);
      toast({
        title: "تم بنجاح",
        description: "تم تحديث العرض",
      });
    }
  };

  const handleDeleteOffer = async (id: string) => {
    const result = await dispatch(deleteOffer(id));
    if (deleteOffer.fulfilled.match(result)) {
      toast({
        title: "تم الحذف",
        description: "تم حذف العرض بنجاح",
      });
    }
  };

  const handleToggleOfferStatus = async (id: string, currentStatus: "active" | "inactive") => {
    await dispatch(toggleOfferStatus({ id, currentStatus }));
  };

  const handleEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setShowEditDialog(true);
  };

  const getStatusBadge = (status: string) => {
    return status === "active" ? (
      <Badge className="bg-green-500/20 text-green-400">نشط</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400">متوقف</Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-white">إدارة العروض</CardTitle>

          {/* Add Offer Dialog */}
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة عرض جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">إضافة عرض جديد</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <InputField
                  label="عنوان العرض"
                  value={newOffer.title}
                  placeholder="مثال: تحميل التطبيق"
                  onChange={(val) => setNewOffer({ ...newOffer, title: val })}
                />
                <InputField
                  label="الوصف"
                  value={newOffer.description}
                  placeholder="وصف تفصيلي للعرض"
                  onChange={(val) => setNewOffer({ ...newOffer, description: val })}
                />
                <InputField
                  label="النقاط"
                  type="number"
                  value={newOffer.points}
                  placeholder="مثال: 10"
                  onChange={(val) => setNewOffer({ ...newOffer, points: parseInt(val) })}
                />
                <InputField
                  label="الفئة"
                  value={newOffer.category}
                  placeholder="مثال: تطبيقات، ألعاب، تسوق"
                  onChange={(val) => setNewOffer({ ...newOffer, category: val })}
                />
                <InputField
                  label="رابط العرض"
                  type="url"
                  value={newOffer.offerurl}
                  placeholder="مثال: https://example.com"
                  onChange={(val) => setNewOffer({ ...newOffer, offerurl: val })}
                />
                <InputField
                  label="الأيقونة"
                  value={newOffer.iconText}
                  placeholder="أدخل أي رمز مثل 🎁"
                  onChange={(val) => setNewOffer({ ...newOffer, iconText: val })}
                />
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddOffer}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    إضافة العرض
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Offer Dialog */}
          <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">تعديل العرض</DialogTitle>
              </DialogHeader>
              {editingOffer && (
                <div className="space-y-4">
                  <InputField
                    label="عنوان العرض"
                    value={editingOffer.title}
                    onChange={(val) => setEditingOffer({ ...editingOffer, title: val })}
                  />
                  <InputField
                    label="الوصف"
                    value={editingOffer.description || ""}
                    onChange={(val) =>
                      setEditingOffer({ ...editingOffer, description: val })
                    }
                  />
                  <InputField
                    label="النقاط"
                    type="number"
                    value={editingOffer.points}
                    onChange={(val) =>
                      setEditingOffer({ ...editingOffer, points: parseInt(val) })
                    }
                  />
                  <InputField
                    label="الفئة"
                    value={editingOffer.category || ""}
                    onChange={(val) =>
                      setEditingOffer({ ...editingOffer, category: val })
                    }
                  />
                  <InputField
                    label="رابط العرض"
                    type="url"
                    value={editingOffer.offerurl || ""}
                    onChange={(val) =>
                      setEditingOffer({ ...editingOffer, offerurl: val })
                    }
                  />
                  <InputField
                    label="الأيقونة"
                    value={editingOffer.iconText || ""}
                    placeholder="أدخل أي رمز مثل 🎁"
                    onChange={(val) =>
                      setEditingOffer({ ...editingOffer, iconText: val })
                    }
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowEditDialog(false)}
                    >
                      إلغاء
                    </Button>
                    <Button
                      onClick={handleEditOfferSave}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      تحديث العرض
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardHeader>

        <CardContent>
          {offers.length === 0 ? (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">🎁</div>
              <p className="text-xl">لا توجد عروض حالياً</p>
              <p className="text-sm text-gray-500 mt-2">قم بإضافة عرض جديد للبدء</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {offers.map((offer) => (
                <Card
                  key={offer.id}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center text-xl">
                          {offer.iconText || "🎁"}
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">{offer.title}</h3>
                          <p className="text-gray-400 text-sm">{offer.category}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleOfferStatus(offer.id, offer.status)}
                          className={`${
                            offer.status === "active"
                              ? "border-red-500/50 text-red-400 hover:bg-red-500/20"
                              : "border-green-500/50 text-green-400 hover:bg-green-500/20"
                          }`}
                        >
                          {offer.status === "active" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditOffer(offer)}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteOffer(offer.id)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-4 line-clamp-2">{offer.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">النقاط:</span>
                        <span className="text-green-400 font-medium">{offer.points || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">الحالة:</span>
                        <span>{getStatusBadge(offer.status)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">رابط العرض:</span>
                        <a href={offer.offerurl} target="_blank" className="text-blue-400 underline">
                          {offer.offerurl}
                        </a>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        onClick={() => handleEditOffer(offer)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
                        onClick={() => handleDeleteOffer(offer.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        حذف
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OffersManagement;

interface InputFieldProps {
  label: string;
  value: string | number;
  type?: string;
  placeholder?: string;
  onChange: (val: string) => void;
}
const InputField = ({ label, value, onChange, type = "text", placeholder }: InputFieldProps) => (
  <div>
    <Label className="text-gray-300">{label}</Label>
    <Input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="bg-gray-800 border-gray-600 text-white"
    />
  </div>
);
