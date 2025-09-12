import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Trash2,
  Filter,
  Plus,
  Edit,
  Loader2,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  updateParticipantStatus,
  type Participant
} from "@/store/slices/participantsSlice";

const ParticipantsManagement = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { participants, loading, error } = useAppSelector(
    (state) => state.participants
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [newParticipant, setNewParticipant] = useState({
    name: "",
    email: "",
    phone: "",
    facebook: "",
    instagram: "",
    twitter: "",
    tiktok: ""
  });

  useEffect(() => {
    dispatch(fetchParticipants());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast({
        title: "خطأ",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || participant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAddParticipant = async () => {
    if (!newParticipant.name || !newParticipant.email) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الاسم والبريد الإلكتروني",
        variant: "destructive"
      });
      return;
    }

    const participantData = {
      name: newParticipant.name,
      email: newParticipant.email,
      phone: newParticipant.phone,
      socialMediaLinks: {
        facebook: newParticipant.facebook || undefined,
        instagram: newParticipant.instagram || undefined,
        twitter: newParticipant.twitter || undefined,
        tiktok: newParticipant.tiktok || undefined
      },
      referralCode: `REF${Date.now()}`,
      status: "active" as const
    };

    const result = await dispatch(addParticipant(participantData));
    if (addParticipant.fulfilled.match(result)) {
      setNewParticipant({
        name: "",
        email: "",
        phone: "",
        facebook: "",
        instagram: "",
        twitter: "",
        tiktok: ""
      });
      setShowAddDialog(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المشترك بنجاح"
      });
    }
  };

  const handleDeleteParticipant = async (id: string) => {
    const result = await dispatch(deleteParticipant(id));
    if (deleteParticipant.fulfilled.match(result)) {
      toast({
        title: "تم الحذف",
        description: "تم حذف المشترك بنجاح"
      });
    }
  };

  const handleEditParticipant = (participant: Participant) => {
    setEditingParticipant(participant);
    setShowEditDialog(true);
  };

  const handleUpdateParticipant = async () => {
    if (!editingParticipant) return;

    const result = await dispatch(
      updateParticipant({
        id: editingParticipant.id,
        participantData: editingParticipant
      })
    );

    if (updateParticipant.fulfilled.match(result)) {
      setShowEditDialog(false);
      setEditingParticipant(null);
      toast({
        title: "تم بنجاح",
        description: "تم تحديث بيانات المشترك"
      });
    }
  };

  const handleStatusChange = async (
    id: string,
    status: "active" | "inactive" | "banned"
  ) => {
    await dispatch(updateParticipantStatus({ id, status }));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-400">نشط</Badge>;
      case "inactive":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400">غير نشط</Badge>
        );
      case "banned":
        return <Badge className="bg-red-500/20 text-red-400">محظور</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">غير محدد</Badge>;
    }
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
          <CardTitle className="text-white">إدارة المشتركين</CardTitle>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة مشترك جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">
                  إضافة مشترك جديد
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-300">الاسم</Label>
                  <Input
                    value={newParticipant.name}
                    onChange={(e) =>
                      setNewParticipant({
                        ...newParticipant,
                        name: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="اسم المشترك"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">البريد الإلكتروني</Label>
                  <Input
                    type="email"
                    value={newParticipant.email}
                    onChange={(e) =>
                      setNewParticipant({
                        ...newParticipant,
                        email: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">رقم الهاتف</Label>
                  <Input
                    value={newParticipant.phone}
                    onChange={(e) =>
                      setNewParticipant({
                        ...newParticipant,
                        phone: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="+966500000000"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">فيسبوك</Label>
                    <Input
                      value={newParticipant.facebook}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                          facebook: e.target.value
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="رابط فيسبوك"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">إنستاجرام</Label>
                    <Input
                      value={newParticipant.instagram}
                      onChange={(e) =>
                        setNewParticipant({
                          ...newParticipant,
                          instagram: e.target.value
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="رابط إنستاجرام"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddParticipant}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    إضافة المشترك
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="البحث في المشتركين..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-gray-800 border-gray-600 text-white">
                  <SelectValue placeholder="الحالة" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="all" className="text-white">
                    جميع الحالات
                  </SelectItem>
                  <SelectItem value="active" className="text-white">
                    نشط
                  </SelectItem>
                  <SelectItem value="inactive" className="text-white">
                    غير نشط
                  </SelectItem>
                  <SelectItem value="banned" className="text-white">
                    محظور
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cards Grid */}
          {filteredParticipants.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-xl">لا يوجد مشاركون حالياً</p>
              <p className="text-sm text-gray-500 mt-2">
                قم بإضافة مشترك جديد للبدء
              </p>
            </div>
          )}

          {filteredParticipants.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredParticipants.map((participant) => (
                <Card
                  key={participant.id}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {participant.name}
                          </h3>
                          <p className="text-gray-400 text-sm">
                            {participant.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditParticipant(participant)}
                          className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleDeleteParticipant(participant.id)
                          }
                          className="border-red-500/50 text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-white font-bold">
                          {participant.totalPoints || 0}
                        </div>
                        <div className="text-gray-400 text-xs">النقاط</div>
                      </div>
                      <div className="text-center">
                        <div className="text-yellow-400 font-bold">
                          {participant.joinDate || "غير محدد"}
                        </div>
                        <div className="text-gray-400 text-xs">
                          تاريخ الانضمام
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">الهاتف:</span>
                        <span className="text-blue-400 font-medium">
                          {participant.phone || "غير محدد"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">الحالة:</span>
                        <Select
                          value={participant.status}
                          onValueChange={(
                            value: "active" | "inactive" | "banned"
                          ) => handleStatusChange(participant.id, value)}
                        >
                          <SelectTrigger className="w-24 bg-transparent border-none p-0 h-6">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-600">
                            <SelectItem value="active" className="text-white">
                              نشط
                            </SelectItem>
                            <SelectItem value="inactive" className="text-white">
                              غير نشط
                            </SelectItem>
                            <SelectItem value="banned" className="text-white">
                              محظور
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        onClick={() => handleEditParticipant(participant)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        تعديل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
                        onClick={() => handleDeleteParticipant(participant.id)}
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

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">
              تعديل بيانات المشترك
            </DialogTitle>
          </DialogHeader>
          {editingParticipant && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">الاسم</Label>
                <Input
                  value={editingParticipant.name}
                  onChange={(e) =>
                    setEditingParticipant({
                      ...editingParticipant,
                      name: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">البريد الإلكتروني</Label>
                <Input
                  type="email"
                  value={editingParticipant.email}
                  onChange={(e) =>
                    setEditingParticipant({
                      ...editingParticipant,
                      email: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">رقم الهاتف</Label>
                <Input
                  value={editingParticipant.phone}
                  onChange={(e) =>
                    setEditingParticipant({
                      ...editingParticipant,
                      phone: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleUpdateParticipant}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  تحديث البيانات
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticipantsManagement;
