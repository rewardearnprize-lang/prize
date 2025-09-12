import { database, firestore } from "./firebase";
import { ref, get, set } from "firebase/database";
import { collection, addDoc, getDocs } from "firebase/firestore";

export interface FirebaseTestResult {
  realtimeDatabase: {
    connected: boolean;
    error?: string;
    testData?: any;
  };
  firestore: {
    connected: boolean;
    error?: string;
    testData?: any;
  };
  recommendations: string[];
}

export const testFirebaseConnection = async (): Promise<FirebaseTestResult> => {
  const result: FirebaseTestResult = {
    realtimeDatabase: { connected: false },
    firestore: { connected: false },
    recommendations: []
  };

  // Test Realtime Database
  try {
    console.log("🔍 Testing Realtime Database connection...");
    const testRef = ref(database, "connection_test");

    // Try to write test data
    await set(testRef, {
      timestamp: new Date().toISOString(),
      message: "Connection test successful"
    });

    // Try to read test data
    const snapshot = await get(testRef);
    if (snapshot.exists()) {
      result.realtimeDatabase = {
        connected: true,
        testData: snapshot.val()
      };
      console.log("✅ Realtime Database connection successful");
    } else {
      result.realtimeDatabase = {
        connected: false,
        error: "Could not read test data"
      };
      result.recommendations.push("Check Realtime Database security rules");
    }
  } catch (error: any) {
    console.error("❌ Realtime Database connection failed:", error);
    result.realtimeDatabase = {
      connected: false,
      error: error.message
    };

    if (error.code === "PERMISSION_DENIED") {
      result.recommendations.push(
        "Update Realtime Database security rules to allow read/write"
      );
    } else if (error.code === "UNAVAILABLE") {
      result.recommendations.push(
        "Check internet connection and Firebase project status"
      );
    } else {
      result.recommendations.push(
        "Check Firebase configuration and project settings"
      );
    }
  }

  // Test Firestore
  try {
    console.log("🔍 Testing Firestore connection...");
    const testCollection = collection(firestore, "connection_test");

    // Try to write test data
    const docRef = await addDoc(testCollection, {
      timestamp: new Date().toISOString(),
      message: "Firestore connection test successful"
    });

    // Try to read test data
    const querySnapshot = await getDocs(testCollection);
    if (!querySnapshot.empty) {
      result.firestore = {
        connected: true,
        testData: querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      };
      console.log("✅ Firestore connection successful");
    } else {
      result.firestore = {
        connected: false,
        error: "Could not read test data"
      };
      result.recommendations.push("Check Firestore security rules");
    }
  } catch (error: any) {
    console.error("❌ Firestore connection failed:", error);
    result.firestore = {
      connected: false,
      error: error.message
    };

    if (error.code === "permission-denied") {
      result.recommendations.push(
        "Update Firestore security rules to allow read/write"
      );
    } else if (error.code === "unavailable") {
      result.recommendations.push(
        "Check internet connection and Firebase project status"
      );
    } else {
      result.recommendations.push(
        "Check Firebase configuration and project settings"
      );
    }
  }

  // General recommendations
  if (!result.realtimeDatabase.connected && !result.firestore.connected) {
    result.recommendations.push("Verify Firebase project ID and configuration");
    result.recommendations.push(
      "Check if Firebase services are enabled in console"
    );
    result.recommendations.push("Ensure proper API keys and authentication");
  }

  return result;
};

export const checkFirebaseIndexes = async (): Promise<string[]> => {
  const missingIndexes: string[] = [];

  try {
    // Test common queries that might need indexes
    const offersRef = ref(database, "offers");
    const participantsRef = ref(database, "participants");
    const winnersRef = ref(database, "winners");
    const drawsRef = ref(database, "draws");

    // Try to fetch data to see if indexes are needed
    await get(offersRef);
    await get(participantsRef);
    await get(winnersRef);
    await get(drawsRef);

    console.log("✅ Basic data fetching successful - indexes may be working");
  } catch (error: any) {
    console.error("❌ Data fetching failed:", error);
    if (error.message.includes("index")) {
      missingIndexes.push(
        "Database indexes are missing or incorrectly configured"
      );
      missingIndexes.push("Add required indexes in Firebase Console");
    }
  }

  return missingIndexes;
};

export const getFirebaseStatus = async () => {
  console.log("🚀 Starting Firebase connection test...");

  const connectionResult = await testFirebaseConnection();
  const missingIndexes = await checkFirebaseIndexes();

  const status = {
    ...connectionResult,
    missingIndexes,
    timestamp: new Date().toISOString()
  };

  console.log("📊 Firebase Status:", status);
  return status;
};
