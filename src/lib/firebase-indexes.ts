import { database, firestore } from "./firebase";
import { ref, set, get } from "firebase/database";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";

// Indexes configuration for Realtime Database
export const createRealtimeDatabaseIndexes = async () => {
  console.log("🔧 Creating Realtime Database indexes...");

  try {
    // Create indexes collection
    const indexesRef = ref(database, "indexes");

    const indexes = {
      offers: {
        status: "ascending",
        category: "ascending",
        createdDate: "descending",
        composite: [
          { status: "ascending", category: "ascending" },
          { status: "ascending", createdDate: "descending" }
        ]
      },
      participants: {
        status: "ascending",
        joinDate: "descending",
        totalPoints: "descending",
        composite: [
          { status: "ascending", joinDate: "descending" },
          { status: "ascending", totalPoints: "descending" }
        ]
      },
      winners: {
        status: "ascending",
        winDate: "descending",
        drawId: "ascending",
        participantId: "ascending",
        composite: [
          { status: "ascending", winDate: "descending" },
          { drawId: "ascending", status: "ascending" }
        ]
      },
      draws: {
        status: "ascending",
        startDate: "descending",
        endDate: "descending",
        composite: [
          { status: "ascending", startDate: "descending" },
          { status: "ascending", endDate: "descending" }
        ]
      },
      settings: {
        updatedAt: "descending"
      },
      stats: {
        lastUpdated: "descending"
      }
    };

    await set(indexesRef, indexes);
    console.log("✅ Realtime Database indexes created successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to create Realtime Database indexes:", error);
    return false;
  }
};

// Indexes configuration for Firestore
export const createFirestoreIndexes = async () => {
  console.log("🔧 Creating Firestore indexes...");

  try {
    const indexesCollection = collection(firestore, "indexes");

    const firestoreIndexes = {
      offers: {
        fields: [
          { fieldPath: "status", order: "ASCENDING" },
          { fieldPath: "category", order: "ASCENDING" },
          { fieldPath: "createdDate", order: "DESCENDING" }
        ],
        composite: [
          {
            fields: [
              { fieldPath: "status", order: "ASCENDING" },
              { fieldPath: "category", order: "ASCENDING" }
            ]
          },
          {
            fields: [
              { fieldPath: "status", order: "ASCENDING" },
              { fieldPath: "createdDate", order: "DESCENDING" }
            ]
          }
        ]
      },
      participants: {
        fields: [
          { fieldPath: "status", order: "ASCENDING" },
          { fieldPath: "joinDate", order: "DESCENDING" },
          { fieldPath: "totalPoints", order: "DESCENDING" }
        ],
        composite: [
          {
            fields: [
              { fieldPath: "status", order: "ASCENDING" },
              { fieldPath: "joinDate", order: "DESCENDING" }
            ]
          },
          {
            fields: [
              { fieldPath: "status", order: "ASCENDING" },
              { fieldPath: "totalPoints", order: "DESCENDING" }
            ]
          }
        ]
      },
      winners: {
        fields: [
          { fieldPath: "status", order: "ASCENDING" },
          { fieldPath: "winDate", order: "DESCENDING" },
          { fieldPath: "drawId", order: "ASCENDING" },
          { fieldPath: "participantId", order: "ASCENDING" }
        ],
        composite: [
          {
            fields: [
              { fieldPath: "status", order: "ASCENDING" },
              { fieldPath: "winDate", order: "DESCENDING" }
            ]
          },
          {
            fields: [
              { fieldPath: "drawId", order: "ASCENDING" },
              { fieldPath: "status", order: "ASCENDING" }
            ]
          }
        ]
      },
      draws: {
        fields: [
          { fieldPath: "status", order: "ASCENDING" },
          { fieldPath: "startDate", order: "DESCENDING" },
          { fieldPath: "endDate", order: "DESCENDING" }
        ],
        composite: [
          {
            fields: [
              { fieldPath: "status", order: "ASCENDING" },
              { fieldPath: "startDate", order: "DESCENDING" }
            ]
          },
          {
            fields: [
              { fieldPath: "status", order: "ASCENDING" },
              { fieldPath: "endDate", order: "DESCENDING" }
            ]
          }
        ]
      }
    };

    // Create index documents
    for (const [collectionName, indexConfig] of Object.entries(
      firestoreIndexes
    )) {
      const indexDoc = doc(indexesCollection, collectionName);
      await setDoc(indexDoc, {
        ...indexConfig,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    console.log("✅ Firestore indexes created successfully");
    return true;
  } catch (error) {
    console.error("❌ Failed to create Firestore indexes:", error);
    return false;
  }
};

// Create all indexes
export const createAllIndexes = async () => {
  console.log("🚀 Creating all Firebase indexes...");

  const realtimeResult = await createRealtimeDatabaseIndexes();
  const firestoreResult = await createFirestoreIndexes();

  return {
    realtimeDatabase: realtimeResult,
    firestore: firestoreResult,
    success: realtimeResult && firestoreResult
  };
};

// Check if indexes exist
export const checkIndexesExist = async () => {
  try {
    // Check Realtime Database indexes
    const indexesRef = ref(database, "indexes");
    const snapshot = await get(indexesRef);

    // Check Firestore indexes
    const indexesCollection = collection(firestore, "indexes");
    const querySnapshot = await getDocs(indexesCollection);

    return {
      realtimeDatabase: snapshot.exists(),
      firestore: !querySnapshot.empty,
      hasIndexes: snapshot.exists() && !querySnapshot.empty
    };
  } catch (error) {
    console.error("❌ Failed to check indexes:", error);
    return {
      realtimeDatabase: false,
      firestore: false,
      hasIndexes: false
    };
  }
};
