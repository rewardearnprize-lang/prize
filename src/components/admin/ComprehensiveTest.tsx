import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchOffers,
  addOffer,
  updateOffer,
  deleteOffer,
  toggleOfferStatus
} from "@/store/slices/offersSlice";
import {
  fetchParticipants,
  addParticipant,
  updateParticipant,
  deleteParticipant,
  updateParticipantStatus
} from "@/store/slices/participantsSlice";
import {
  fetchWinners,
  addWinner,
  updateWinner,
  deleteWinner,
  updateWinnerStatus
} from "@/store/slices/winnersSlice";
import {
  fetchDraws,
  addDraw,
  updateDraw,
  deleteDraw,
  updateDrawStatus
} from "@/store/slices/drawsSlice";

interface TestResult {
  section: string;
  operation: string;
  success: boolean;
  message: string;
  dataBefore?: any[];
  dataAfter?: any[];
  error?: string;
}

export default function ComprehensiveTest() {
  const dispatch = useAppDispatch();
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [currentTest, setCurrentTest] = useState("");

  // Get data from store
  const offers = useAppSelector((state) => state.offers.offers);
  const participants = useAppSelector(
    (state) => state.participants.participants
  );
  const winners = useAppSelector((state) => state.winners.winners);
  const draws = useAppSelector((state) => state.draws.draws);

  const runComprehensiveTest = async () => {
    setIsRunning(true);
    setResults([]);

    console.log("🚀 Starting comprehensive test...");

    // Test 1: Fetch all data
    setCurrentTest("جلب البيانات");
    await testFetchData();

    // Test 2: Test Offers CRUD
    setCurrentTest("اختبار العروض");
    await testOffersCRUD();

    // Test 3: Test Participants CRUD
    setCurrentTest("اختبار المشتركين");
    await testParticipantsCRUD();

    // Test 4: Test Winners CRUD
    setCurrentTest("اختبار الفائزين");
    await testWinnersCRUD();

    // Test 5: Test Draws CRUD
    setCurrentTest("اختبار السحوبات");
    await testDrawsCRUD();

    // Test 6: Final verification
    setCurrentTest("التحقق النهائي");
    await testFinalVerification();

    setIsRunning(false);
    setCurrentTest("");
    console.log("✅ Comprehensive test completed!");
  };

  const testFetchData = async () => {
    try {
      // Fetch all data
      await Promise.all([
        dispatch(fetchOffers()),
        dispatch(fetchParticipants()),
        dispatch(fetchWinners()),
        dispatch(fetchDraws())
      ]);

      addResult({
        section: "جلب البيانات",
        operation: "Fetch All Data",
        success: true,
        message: `تم جلب البيانات: ${offers.length} عروض، ${participants.length} مشتركين، ${winners.length} فائزين، ${draws.length} سحوبات`
      });
    } catch (error) {
      addResult({
        section: "جلب البيانات",
        operation: "Fetch All Data",
        success: false,
        message: "فشل في جلب البيانات",
        error: error as string
      });
    }
  };

  const testOffersCRUD = async () => {
    const dataBefore = [...offers];

    try {
      // Test Add
      const newOffer = {
        title: `عرض اختبار ${Date.now()}`,
        description: "وصف اختبار للعرض",
        points: 100,
        category: "test",
        status: "active" as const,
        maxParticipants: 50,
        imageUrl: "https://example.com/image.jpg"
      };

      const addOfferResult = await dispatch(addOffer(newOffer));
      if (addOffer.fulfilled.match(addOfferResult)) {
        const addedOffer = addOfferResult.payload;

        addResult({
          section: "العروض",
          operation: "إضافة عرض",
          success: true,
          message: `تم إضافة العرض: ${addedOffer.title}`,
          dataBefore,
          dataAfter: [...offers]
        });

        // Test Update
        const updateData = {
          id: addedOffer.id,
          offerData: { title: `${addedOffer.title} - محدث` }
        };

        const updateResult = await dispatch(updateOffer(updateData));
        if (updateOffer.fulfilled.match(updateResult)) {
          addResult({
            section: "العروض",
            operation: "تحديث عرض",
            success: true,
            message: `تم تحديث العرض: ${addedOffer.title}`,
            dataBefore,
            dataAfter: [...offers]
          });
        }

        // Test Delete
        const deleteResult = await dispatch(deleteOffer(addedOffer.id));
        if (deleteOffer.fulfilled.match(deleteResult)) {
          addResult({
            section: "العروض",
            operation: "حذف عرض",
            success: true,
            message: `تم حذف العرض: ${addedOffer.title}`,
            dataBefore,
            dataAfter: [...offers]
          });
        }
      }
    } catch (error) {
      addResult({
        section: "العروض",
        operation: "CRUD Operations",
        success: false,
        message: "فشل في عمليات العروض",
        error: error as string
      });
    }
  };

  const testParticipantsCRUD = async () => {
    const dataBefore = [...participants];

    try {
      // Test Add
      const newParticipant = {
        name: `مشترك اختبار ${Date.now()}`,
        email: `test${Date.now()}@example.com`,
        phone: "+966500000000",
        totalPoints: 150,
        status: "active" as const,
        completedOffers: []
      };

      const addParticipantResult = await dispatch(
        addParticipant(newParticipant)
      );
      if (addParticipant.fulfilled.match(addParticipantResult)) {
        const addedParticipant = addParticipantResult.payload;

        addResult({
          section: "المشتركين",
          operation: "إضافة مشترك",
          success: true,
          message: `تم إضافة المشترك: ${addedParticipant.name}`,
          dataBefore,
          dataAfter: [...participants]
        });

        // Test Update
        const updateData = {
          id: addedParticipant.id,
          participantData: { name: `${addedParticipant.name} - محدث` }
        };

        const updateResult = await dispatch(updateParticipant(updateData));
        if (updateParticipant.fulfilled.match(updateResult)) {
          addResult({
            section: "المشتركين",
            operation: "تحديث مشترك",
            success: true,
            message: `تم تحديث المشترك: ${addedParticipant.name}`,
            dataBefore,
            dataAfter: [...participants]
          });
        }

        // Test Delete
        const deleteResult = await dispatch(
          deleteParticipant(addedParticipant.id)
        );
        if (deleteParticipant.fulfilled.match(deleteResult)) {
          addResult({
            section: "المشتركين",
            operation: "حذف مشترك",
            success: true,
            message: `تم حذف المشترك: ${addedParticipant.name}`,
            dataBefore,
            dataAfter: [...participants]
          });
        }
      }
    } catch (error) {
      addResult({
        section: "المشتركين",
        operation: "CRUD Operations",
        success: false,
        message: "فشل في عمليات المشتركين",
        error: error as string
      });
    }
  };

  const testWinnersCRUD = async () => {
    const dataBefore = [...winners];

    try {
      // Test Add
      const newWinner = {
        participantId: `participant_${Date.now()}`,
        participantName: `فائز اختبار ${Date.now()}`,
        drawId: `draw_${Date.now()}`,
        drawTitle: "سحب اختبار",
        prize: "جائزة اختبار",
        status: "pending" as const
      };

      const addWinnerResult = await dispatch(addWinner(newWinner));
      if (addWinner.fulfilled.match(addWinnerResult)) {
        const addedWinner = addWinnerResult.payload;

        addResult({
          section: "الفائزين",
          operation: "إضافة فائز",
          success: true,
          message: `تم إضافة الفائز: ${addedWinner.participantName}`,
          dataBefore,
          dataAfter: [...winners]
        });

        // Test Update
        const updateData = {
          id: addedWinner.id,
          winnerData: {
            participantName: `${addedWinner.participantName} - محدث`
          }
        };

        const updateResult = await dispatch(updateWinner(updateData));
        if (updateWinner.fulfilled.match(updateResult)) {
          addResult({
            section: "الفائزين",
            operation: "تحديث فائز",
            success: true,
            message: `تم تحديث الفائز: ${addedWinner.participantName}`,
            dataBefore,
            dataAfter: [...winners]
          });
        }

        // Test Delete
        const deleteResult = await dispatch(deleteWinner(addedWinner.id));
        if (deleteWinner.fulfilled.match(deleteResult)) {
          addResult({
            section: "الفائزين",
            operation: "حذف فائز",
            success: true,
            message: `تم حذف الفائز: ${addedWinner.participantName}`,
            dataBefore,
            dataAfter: [...winners]
          });
        }
      }
    } catch (error) {
      addResult({
        section: "الفائزين",
        operation: "CRUD Operations",
        success: false,
        message: "فشل في عمليات الفائزين",
        error: error as string
      });
    }
  };

  const testDrawsCRUD = async () => {
    const dataBefore = [...draws];

    try {
      // Test Add
      const newDraw = {
        title: `سحب اختبار ${Date.now()}`,
        description: "وصف اختبار للسحب",
        prize: "جائزة اختبار",
        prizeValue: 1000,
        maxWinners: 1,
        currentWinners: 0,
        participants: [],
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        status: "active" as const
      };

      const addDrawResult = await dispatch(addDraw(newDraw));
      if (addDraw.fulfilled.match(addDrawResult)) {
        const addedDraw = addDrawResult.payload;

        addResult({
          section: "السحوبات",
          operation: "إضافة سحب",
          success: true,
          message: `تم إضافة السحب: ${addedDraw.title}`,
          dataBefore,
          dataAfter: [...draws]
        });

        // Test Update
        const updateData = {
          id: addedDraw.id,
          drawData: { title: `${addedDraw.title} - محدث` }
        };

        const updateResult = await dispatch(updateDraw(updateData));
        if (updateDraw.fulfilled.match(updateResult)) {
          addResult({
            section: "السحوبات",
            operation: "تحديث سحب",
            success: true,
            message: `تم تحديث السحب: ${addedDraw.title}`,
            dataBefore,
            dataAfter: [...draws]
          });
        }

        // Test Delete
        const deleteResult = await dispatch(deleteDraw(addedDraw.id));
        if (deleteDraw.fulfilled.match(deleteResult)) {
          addResult({
            section: "السحوبات",
            operation: "حذف سحب",
            success: true,
            message: `تم حذف السحب: ${addedDraw.title}`,
            dataBefore,
            dataAfter: [...draws]
          });
        }
      }
    } catch (error) {
      addResult({
        section: "السحوبات",
        operation: "CRUD Operations",
        success: false,
        message: "فشل في عمليات السحوبات",
        error: error as string
      });
    }
  };

  const testFinalVerification = async () => {
    try {
      // Fetch data again to verify
      await Promise.all([
        dispatch(fetchOffers()),
        dispatch(fetchParticipants()),
        dispatch(fetchWinners()),
        dispatch(fetchDraws())
      ]);

      addResult({
        section: "التحقق النهائي",
        operation: "Final Verification",
        success: true,
        message: `التحقق النهائي: ${offers.length} عروض، ${participants.length} مشتركين، ${winners.length} فائزين، ${draws.length} سحوبات`
      });
    } catch (error) {
      addResult({
        section: "التحقق النهائي",
        operation: "Final Verification",
        success: false,
        message: "فشل في التحقق النهائي",
        error: error as string
      });
    }
  };

  const addResult = (result: TestResult) => {
    setResults((prev) => [...prev, result]);
  };

  const getSuccessCount = () => results.filter((r) => r.success).length;
  const getTotalCount = () => results.length;

  return (
    <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          اختبار شامل لجميع العمليات
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Test Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={runComprehensiveTest}
            disabled={isRunning}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              "تشغيل الاختبار الشامل"
            )}
          </Button>

          {isRunning && (
            <Badge className="bg-yellow-500/20 text-yellow-400">
              {currentTest}
            </Badge>
          )}
        </div>

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-medium">
                نجح: {getSuccessCount()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-400" />
              <span className="text-red-400 font-medium">
                فشل: {getTotalCount() - getSuccessCount()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-300">إجمالي: {getTotalCount()}</span>
            </div>
          </div>
        )}

        {/* Detailed Results */}
        {results.length > 0 && (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${
                  result.success
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {result.success ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <Badge
                    className={
                      result.success
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }
                  >
                    {result.section}
                  </Badge>
                  <span className="text-gray-300">{result.operation}</span>
                </div>

                <p className="text-sm text-gray-300 mb-2">{result.message}</p>

                {result.error && (
                  <p className="text-sm text-red-400 bg-red-500/10 p-2 rounded">
                    خطأ:{" "}
                    {typeof result.error === "string"
                      ? result.error
                      : result.error?.message || "خطأ غير معروف"}
                  </p>
                )}

                {result.dataBefore && result.dataAfter && (
                  <div className="text-xs text-gray-400 mt-2">
                    <span>قبل: {result.dataBefore.length} | </span>
                    <span>بعد: {result.dataAfter.length}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Current Data Status */}
        <Separator className="bg-gray-700" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">
              {offers.length}
            </div>
            <div className="text-sm text-gray-400">العروض</div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-400">
              {participants.length}
            </div>
            <div className="text-sm text-gray-400">المشتركين</div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">
              {winners.length}
            </div>
            <div className="text-sm text-gray-400">الفائزين</div>
          </div>
          <div className="text-center p-3 bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">
              {draws.length}
            </div>
            <div className="text-sm text-gray-400">السحوبات</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
