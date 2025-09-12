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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Eye,
  Power,
  PowerOff
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchMainPageData,
  addMainPageData,
  updateMainPageData,
  deleteMainPageData,
  toggleActiveStatus,
  type MainPageData
} from "@/store/slices/mainPageDataSlice";

const MainPageDataManagement = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { mainPageData, loading, error } = useAppSelector(
    (state) => state.mainPageData
  );

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [editingData, setEditingData] = useState<MainPageData | null>(null);
  const [viewingData, setViewingData] = useState<MainPageData | null>(null);
  const [newData, setNewData] = useState({
    title: "",
    description: "",
    category: "",
    value: "",
    icon: "",
    isActive: true,
    currentParticipations: 0,
    maxParticipations: 100,
    requirements: [""],
    reward: 1,
    estimatedTime: 10,
    difficulty: "easy" as const
  });

  useEffect(() => {
    dispatch(fetchMainPageData());
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

  const handleAddData = async () => {
    if (!newData.title || !newData.description || !newData.category) {
      toast({
        title: "خطأ",
        description: "يرجى ملء البيانات المطلوبة",
        variant: "destructive"
      });
      return;
    }

    const dataToAdd = {
      ...newData,
      requirements: newData.requirements.filter((req) => req.trim() !== "")
    };

    const result = await dispatch(addMainPageData(dataToAdd));
    if (addMainPageData.fulfilled.match(result)) {
      setNewData({
        title: "",
        description: "",
        category: "",
        value: "",
        icon: "",
        isActive: true,
        currentParticipations: 0,
        maxParticipations: 100,
        requirements: [""],
        reward: 1,
        estimatedTime: 10,
        difficulty: "easy" as const
      });
      setShowAddDialog(false);
      toast({
        title: "تم بنجاح",
        description: "تم إضافة البيانات بنجاح"
      });
    }
  };

  const handleDeleteData = async (id: string) => {
    const result = await dispatch(deleteMainPageData(id));
    if (deleteMainPageData.fulfilled.match(result)) {
      toast({
        title: "تم الحذف",
        description: "تم حذف البيانات بنجاح"
      });
    }
  };

  const handleEditData = (data: MainPageData) => {
    setEditingData(data);
    setShowEditDialog(true);
  };

  const handleViewData = (data: MainPageData) => {
    setViewingData(data);
    setShowViewDialog(true);
  };

  const handleToggleActive = async (id: string) => {
    const result = await dispatch(toggleActiveStatus(id));
    if (toggleActiveStatus.fulfilled.match(result)) {
      toast({
        title: "تم التحديث",
        description: "تم تغيير حالة النشاط بنجاح"
      });
    }
  };

  const handleUpdateData = async () => {
    if (!editingData) return;

    const result = await dispatch(
      updateMainPageData({
        id: editingData.id,
        data: editingData
      })
    );

    if (updateMainPageData.fulfilled.match(result)) {
      setShowEditDialog(false);
      setEditingData(null);
      toast({
        title: "تم بنجاح",
        description: "تم تحديث البيانات"
      });
    }
  };

  const addRequirement = () => {
    setNewData({
      ...newData,
      requirements: [...newData.requirements, ""]
    });
  };

  const removeRequirement = (index: number) => {
    setNewData({
      ...newData,
      requirements: newData.requirements.filter((_, i) => i !== index)
    });
  };

  const updateRequirement = (index: number, value: string) => {
    const updatedRequirements = [...newData.requirements];
    updatedRequirements[index] = value;
    setNewData({
      ...newData,
      requirements: updatedRequirements
    });
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return <Badge className="bg-green-500/20 text-green-400">سهل</Badge>;
      case "medium":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-400">متوسط</Badge>
        );
      case "hard":
        return <Badge className="bg-red-500/20 text-red-400">صعب</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">غير محدد</Badge>;
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-500/20 text-green-400">نشط</Badge>
    ) : (
      <Badge className="bg-gray-500/20 text-gray-400">غير نشط</Badge>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-sm border-white/20">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-white">
              إدارة بيانات الصفحة الرئيسية
            </CardTitle>
            <p className="text-gray-300 text-sm mt-1">
              إجمالي العناصر: {mainPageData.length} | نشط:{" "}
              {mainPageData.filter((item) => item.isActive).length} | غير نشط:{" "}
              {mainPageData.filter((item) => !item.isActive).length}
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600">
                <Plus className="w-4 h-4 mr-2" />
                إضافة عنصر جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-white">
                  إضافة عنصر جديد للصفحة الرئيسية
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">العنوان</Label>
                    <Input
                      value={newData.title}
                      onChange={(e) =>
                        setNewData({ ...newData, title: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="عنوان العنصر"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">الفئة</Label>
                    <Input
                      value={newData.category}
                      onChange={(e) =>
                        setNewData({ ...newData, category: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="مثال: Electronics"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">الوصف</Label>
                  <Textarea
                    value={newData.description}
                    onChange={(e) =>
                      setNewData({ ...newData, description: e.target.value })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="وصف العنصر"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">القيمة</Label>
                    <Input
                      value={newData.value}
                      onChange={(e) =>
                        setNewData({ ...newData, value: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="مثال: $1,299"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">الأيقونة</Label>
                    <Input
                      value={newData.icon}
                      onChange={(e) =>
                        setNewData({ ...newData, icon: e.target.value })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="مثال: 💻"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-300">المشاركات الحالية</Label>
                    <Input
                      type="number"
                      value={newData.currentParticipations}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          currentParticipations: parseInt(e.target.value) || 0
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">
                      الحد الأقصى للمشاركات
                    </Label>
                    <Input
                      type="number"
                      value={newData.maxParticipations}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          maxParticipations: parseInt(e.target.value) || 100
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">المكافأة</Label>
                    <Input
                      type="number"
                      value={newData.reward}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          reward: parseInt(e.target.value) || 1
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-300">
                      الوقت المقدر (دقائق)
                    </Label>
                    <Input
                      type="number"
                      value={newData.estimatedTime}
                      onChange={(e) =>
                        setNewData({
                          ...newData,
                          estimatedTime: parseInt(e.target.value) || 10
                        })
                      }
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-300">مستوى الصعوبة</Label>
                    <Select
                      value={newData.difficulty}
                      onValueChange={(value: "easy" | "medium" | "hard") =>
                        setNewData({ ...newData, difficulty: value })
                      }
                    >
                      <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        <SelectItem value="easy" className="text-white">
                          سهل
                        </SelectItem>
                        <SelectItem value="medium" className="text-white">
                          متوسط
                        </SelectItem>
                        <SelectItem value="hard" className="text-white">
                          صعب
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-gray-300">المتطلبات</Label>
                  <div className="space-y-2">
                    {newData.requirements.map((req, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={req}
                          onChange={(e) =>
                            updateRequirement(index, e.target.value)
                          }
                          className="bg-gray-800 border-gray-600 text-white"
                          placeholder={`متطلب ${index + 1}`}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeRequirement(index)}
                          className="text-red-400 border-red-400 hover:bg-red-400/20"
                        >
                          حذف
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addRequirement}
                      className="text-blue-400 border-blue-400 hover:bg-blue-400/20"
                    >
                      إضافة متطلب
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newData.isActive}
                    onCheckedChange={(checked) =>
                      setNewData({ ...newData, isActive: checked })
                    }
                  />
                  <Label className="text-gray-300">نشط</Label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowAddDialog(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleAddData}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    إضافة العنصر
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-2 text-gray-300">جاري تحميل البيانات...</span>
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {mainPageData.length === 0 && (
                <div className="col-span-full text-center text-gray-400 py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <p className="text-xl">لا توجد بيانات حالياً</p>
                  <p className="text-sm text-gray-500 mt-2">قم بإضافة عناصر جديدة للبدء</p>
                </div>
              )}

              {mainPageData.length > 0 &&
                mainPageData.map((item) => (
                  <Card key={item.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-3xl">{item.icon}</span>
                          <div>
                            <h3 className="font-bold text-white text-lg">{item.title}</h3>
                            <p className="text-gray-400 text-sm">{item.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-green-400 font-bold text-lg">{item.value}</div>
                          {getStatusBadge(item.isActive)}
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-white font-bold">{item.currentParticipations}/{item.maxParticipations}</div>
                          <div className="text-gray-400 text-xs">المشاركات</div>
                        </div>
                        <div className="text-center">
                          <div className="text-yellow-400 font-bold">{item.reward} نقاط</div>
                          <div className="text-gray-400 text-xs">المكافأة</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        {getDifficultyBadge(item.difficulty)}
                        <div className="text-gray-400 text-sm">{item.estimatedTime} دقيقة</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewData(item)}
                          className="flex-1 border-green-500/50 text-green-400 hover:bg-green-500/20"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          عرض
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleToggleActive(item.id)}
                          className={`flex-1 ${
                            item.isActive
                              ? "border-red-500/50 text-red-400 hover:bg-red-500/20"
                              : "border-green-500/50 text-green-400 hover:bg-green-500/20"
                          }`}
                        >
                          {item.isActive ? (
                            <>
                              <PowerOff className="w-4 h-4 mr-1" />
                              إيقاف
                            </>
                          ) : (
                            <>
                              <Power className="w-4 h-4 mr-1" />
                              تفعيل
                            </>
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditData(item)}
                          className="flex-1 border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          تعديل
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteData(item.id)}
                          className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
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

      {/* View Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-white">تفاصيل العنصر</DialogTitle>
          </DialogHeader>
          {viewingData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">العنوان</Label>
                  <p className="text-white">{viewingData.title}</p>
                </div>
                <div>
                  <Label className="text-gray-300">الفئة</Label>
                  <p className="text-white">{viewingData.category}</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">الوصف</Label>
                <p className="text-white">{viewingData.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">القيمة</Label>
                  <p className="text-white">{viewingData.value}</p>
                </div>
                <div>
                  <Label className="text-gray-300">الأيقونة</Label>
                  <p className="text-white text-2xl">{viewingData.icon}</p>
                </div>
                <div>
                  <Label className="text-gray-300">مستوى الصعوبة</Label>
                  <div className="mt-1">
                    {getDifficultyBadge(viewingData.difficulty)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-gray-300">المشاركات الحالية</Label>
                  <p className="text-white">
                    {viewingData.currentParticipations}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-300">الحد الأقصى</Label>
                  <p className="text-white">{viewingData.maxParticipations}</p>
                </div>
                <div>
                  <Label className="text-gray-300">المكافأة</Label>
                  <p className="text-white">{viewingData.reward} نقاط</p>
                </div>
              </div>

              <div>
                <Label className="text-gray-300">الوقت المقدر</Label>
                <p className="text-white">{viewingData.estimatedTime} دقيقة</p>
              </div>

              <div>
                <Label className="text-gray-300">المتطلبات</Label>
                <ul className="list-disc list-inside text-white space-y-1">
                  {viewingData.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">الحالة</Label>
                  <div className="mt-1">
                    {getStatusBadge(viewingData.isActive)}
                  </div>
                </div>
                <div>
                  <Label className="text-gray-300">تاريخ الإنشاء</Label>
                  <p className="text-white">
                    {new Date(viewingData.createdAt).toLocaleDateString(
                      "ar-SA"
                    )}
                  </p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowViewDialog(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-gray-900 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-white">تعديل العنصر</DialogTitle>
          </DialogHeader>
          {editingData && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">العنوان</Label>
                <Input
                  value={editingData.title}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      title: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div>
                <Label className="text-gray-300">الوصف</Label>
                <Textarea
                  value={editingData.description}
                  onChange={(e) =>
                    setEditingData({
                      ...editingData,
                      description: e.target.value
                    })
                  }
                  className="bg-gray-800 border-gray-600 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-300">القيمة</Label>
                  <Input
                    value={editingData.value}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        value: e.target.value
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label className="text-gray-300">المكافأة</Label>
                  <Input
                    type="number"
                    value={editingData.reward}
                    onChange={(e) =>
                      setEditingData({
                        ...editingData,
                        reward: parseInt(e.target.value) || 1
                      })
                    }
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEditDialog(false)}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleUpdateData}
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

export default MainPageDataManagement;
