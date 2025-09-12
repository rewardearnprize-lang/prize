import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchWinners, addWinner } from "@/store/slices/winnersSlice";

const TimestampTest: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { winners, loading, error } = useSelector(
    (state: RootState) => state.winners
  );
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`
    ]);
  };

  const testTimestampConversion = async () => {
    setTestResults([]);
    addResult("بدء اختبار تحويل الطوابع الزمنية...");

    try {
      // Fetch current winners
      addResult("جاري جلب الفائزين الحاليين...");
      await dispatch(fetchWinners());

      // Check if any winners have non-serializable timestamp values
      const hasNonSerializableTimestamps = winners.some((winner) => {
        return (
          (winner.createdAt && typeof winner.createdAt !== "string") ||
          (winner.updatedAt && typeof winner.updatedAt !== "string") ||
          (winner.deliveryDate && typeof winner.deliveryDate !== "string") ||
          (winner.drawDate && typeof winner.drawDate !== "string")
        );
      });

      if (hasNonSerializableTimestamps) {
        addResult("❌ تم العثور على قيم طوابع زمنية غير قابلة للتسلسل!");
        winners.forEach((winner, index) => {
          if (winner.createdAt && typeof winner.createdAt !== "string") {
            addResult(
              `  - الفائز ${index + 1}: createdAt = ${typeof winner.createdAt}`
            );
          }
          if (winner.updatedAt && typeof winner.updatedAt !== "string") {
            addResult(
              `  - الفائز ${index + 1}: updatedAt = ${typeof winner.updatedAt}`
            );
          }
          if (winner.deliveryDate && typeof winner.deliveryDate !== "string") {
            addResult(
              `  - الفائز ${
                index + 1
              }: deliveryDate = ${typeof winner.deliveryDate}`
            );
          }
          if (winner.drawDate && typeof winner.drawDate !== "string") {
            addResult(
              `  - الفائز ${index + 1}: drawDate = ${typeof winner.drawDate}`
            );
          }
        });
      } else {
        addResult("✅ جميع الطوابع الزمنية قابلة للتسلسل (نوع string)");
      }

      // Test adding a new winner
      addResult("جاري إضافة فائز جديد للاختبار...");
      const newWinner = {
        participantId: `test_${Date.now()}`,
        participantName: `فائز اختبار الطوابع الزمنية ${Date.now()}`,
        drawId: `draw_test_${Date.now()}`,
        drawTitle: "سحب اختبار الطوابع الزمنية",
        prize: "جائزة اختبار",
        status: "pending" as const
      };

      const addWinnerResult = await dispatch(addWinner(newWinner));
      if (addWinner.fulfilled.match(addWinnerResult)) {
        const addedWinner = addWinnerResult.payload;
        addResult(`✅ تم إضافة فائز جديد: ${addedWinner.participantName}`);

        // Check the added winner's timestamp fields
        if (typeof addedWinner.createdAt === "string") {
          addResult(`✅ createdAt: ${addedWinner.createdAt} (نوع: string)`);
        } else {
          addResult(`❌ createdAt: ${typeof addedWinner.createdAt}`);
        }

        if (typeof addedWinner.updatedAt === "string") {
          addResult(`✅ updatedAt: ${addedWinner.updatedAt} (نوع: string)`);
        } else {
          addResult(`❌ updatedAt: ${typeof addedWinner.updatedAt}`);
        }

        if (typeof addedWinner.drawDate === "string") {
          addResult(`✅ drawDate: ${addedWinner.drawDate} (نوع: string)`);
        } else {
          addResult(`❌ drawDate: ${typeof addedWinner.drawDate}`);
        }
      } else {
        addResult("❌ فشل في إضافة فائز جديد");
      }
    } catch (error) {
      addResult(`❌ خطأ في الاختبار: ${error}`);
    }
  };

  useEffect(() => {
    testTimestampConversion();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        اختبار تحويل الطوابع الزمنية
      </h2>

      <div className="mb-4">
        <button
          onClick={testTimestampConversion}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "جاري الاختبار..." : "إعادة تشغيل الاختبار"}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          خطأ: {error}
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-700">نتائج الاختبار:</h3>
        <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
          {testResults.length === 0 ? (
            <p className="text-gray-500">لا توجد نتائج بعد...</p>
          ) : (
            testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono mb-1">
                {result}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          معلومات الفائزين الحاليين:
        </h3>
        <div className="bg-gray-50 p-4 rounded">
          <p className="text-sm text-gray-600">
            عدد الفائزين: {winners.length}
          </p>
          {winners.slice(0, 3).map((winner, index) => (
            <div key={winner.id} className="mt-2 p-2 bg-white rounded border">
              <p className="text-sm">
                <strong>الفائز {index + 1}:</strong> {winner.participantName}
              </p>
              <p className="text-xs text-gray-500">
                createdAt: {typeof winner.createdAt} | updatedAt:{" "}
                {typeof winner.updatedAt} | drawDate: {typeof winner.drawDate}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimestampTest;
