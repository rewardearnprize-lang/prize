import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Loader2,
  Wifi,
  WifiOff,
  Database,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings
} from "lucide-react";
import {
  getFirebaseStatus,
  type FirebaseTestResult
} from "@/lib/firebase-test";
import { createAllIndexes, checkIndexesExist } from "@/lib/firebase-indexes";

const FirebaseTest = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [isCreatingIndexes, setIsCreatingIndexes] = useState(false);
  const [testResult, setTestResult] = useState<FirebaseTestResult | null>(null);
  const [missingIndexes, setMissingIndexes] = useState<string[]>([]);
  const [indexesStatus, setIndexesStatus] = useState<any>(null);

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      const status = await getFirebaseStatus();
      setTestResult(status);
      setMissingIndexes(status.missingIndexes || []);

      // Check indexes status
      const indexesExist = await checkIndexesExist();
      setIndexesStatus(indexesExist);
    } catch (error) {
      console.error("Test failed:", error);
      setTestResult({
        realtimeDatabase: { connected: false, error: "Test failed" },
        firestore: { connected: false, error: "Test failed" },
        recommendations: ["Check console for detailed error information"]
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleCreateIndexes = async () => {
    setIsCreatingIndexes(true);
    try {
      const result = await createAllIndexes();
      if (result.success) {
        // Re-check indexes status
        const indexesExist = await checkIndexesExist();
        setIndexesStatus(indexesExist);
        setMissingIndexes([]);
      }
    } catch (error) {
      console.error("Failed to create indexes:", error);
    } finally {
      setIsCreatingIndexes(false);
    }
  };

  const getStatusIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="w-5 h-5 text-green-500" />
    ) : (
      <XCircle className="w-5 h-5 text-red-500" />
    );
  };

  const getStatusBadge = (connected: boolean) => {
    return connected ? (
      <Badge className="bg-green-500/20 text-green-400">متصل</Badge>
    ) : (
      <Badge className="bg-red-500/20 text-red-400">غير متصل</Badge>
    );
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Wifi className="w-5 h-5 mr-2" />
          اختبار اتصال Firebase
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري الاختبار...
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                اختبار الاتصال
              </>
            )}
          </Button>

          <Button
            onClick={handleCreateIndexes}
            disabled={isCreatingIndexes}
            className="bg-green-500 hover:bg-green-600"
          >
            {isCreatingIndexes ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                جاري إنشاء Indexes...
              </>
            ) : (
              <>
                <Settings className="w-4 h-4 mr-2" />
                إنشاء Indexes
              </>
            )}
          </Button>
        </div>

        {testResult && (
          <div className="space-y-4">
            {/* Realtime Database Status */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-blue-400" />
                <span className="text-white">Realtime Database</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(testResult.realtimeDatabase.connected)}
                {getStatusBadge(testResult.realtimeDatabase.connected)}
              </div>
            </div>

            {/* Firestore Status */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-green-400" />
                <span className="text-white">Firestore</span>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusIcon(testResult.firestore.connected)}
                {getStatusBadge(testResult.firestore.connected)}
              </div>
            </div>

            {/* Indexes Status */}
            {indexesStatus && (
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <span className="text-white">Indexes Status</span>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(indexesStatus.hasIndexes)}
                  {getStatusBadge(indexesStatus.hasIndexes)}
                </div>
              </div>
            )}

            {/* Error Messages */}
            {testResult.realtimeDatabase.error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  <strong>Realtime Database Error:</strong>{" "}
                  {testResult.realtimeDatabase.error}
                </AlertDescription>
              </Alert>
            )}

            {testResult.firestore.error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <AlertDescription className="text-red-300">
                  <strong>Firestore Error:</strong> {testResult.firestore.error}
                </AlertDescription>
              </Alert>
            )}

            {/* Missing Indexes */}
            {missingIndexes.length > 0 && (
              <Alert className="border-yellow-500/50 bg-yellow-500/10">
                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                <AlertDescription className="text-yellow-300">
                  <strong>Missing Indexes:</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {missingIndexes.map((index, i) => (
                      <li key={i}>{index}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Recommendations */}
            {testResult.recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-white font-medium">التوصيات:</h4>
                <ul className="space-y-1">
                  {testResult.recommendations.map((rec, i) => (
                    <li
                      key={i}
                      className="text-gray-300 text-sm flex items-start"
                    >
                      <span className="text-blue-400 mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Fix Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/rules",
                    "_blank"
                  )
                }
                className="border-blue-500/50 text-blue-400 hover:bg-blue-500/20"
              >
                قواعد الأمان
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://console.firebase.google.com/project/fir-project-b3e4e/database/fir-project-b3e4e-default-rtdb/indexes",
                    "_blank"
                  )
                }
                className="border-green-500/50 text-green-400 hover:bg-green-500/20"
              >
                Indexes
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  window.open(
                    "https://console.firebase.google.com/project/fir-project-b3e4e/firestore",
                    "_blank"
                  )
                }
                className="border-purple-500/50 text-purple-400 hover:bg-purple-500/20"
              >
                Firestore
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FirebaseTest;
