import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPoints: number;
  joinDate: string;
  status: "active" | "inactive";
  completedOffers: string[];
  lastActivity: string;
  socialMediaLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
}

interface ParticipantsState {
  participants: Participant[];
  loading: boolean;
  error: string | null;
}

const initialState: ParticipantsState = {
  participants: [],
  loading: false,
  error: null
};

// Fetch participants from Firestore
export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching participants from Firestore...");
      const participantsCollection = collection(firestore, "participants");
      const q = query(participantsCollection, orderBy("joinDate", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const participantsArray: Participant[] = querySnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data()
          })
        ) as Participant[];

        console.log(
          "✅ Participants fetched successfully:",
          participantsArray.length
        );
        return participantsArray;
      } else {
        // Return default participants if no data exists
        console.log("📝 No participants found, returning default data");
        const defaultParticipants: Participant[] = [
          {
            id: "default-1",
            name: "أحمد محمد",
            email: "ahmed@example.com",
            phone: "+201234567890",
            totalPoints: 150,
            joinDate: "2024-01-15",
            status: "active",
            completedOffers: ["offer_1", "offer_2"],
            lastActivity: "2024-01-20"
          },
          {
            id: "default-2",
            name: "سارة أحمد",
            email: "sara@example.com",
            phone: "+201234567891",
            totalPoints: 75,
            joinDate: "2024-01-10",
            status: "active",
            completedOffers: ["offer_1"],
            lastActivity: "2024-01-18"
          },
          {
            id: "default-3",
            name: "محمد علي",
            email: "mohamed@example.com",
            phone: "+201234567892",
            totalPoints: 225,
            joinDate: "2024-01-05",
            status: "active",
            completedOffers: ["offer_1", "offer_2", "offer_3"],
            lastActivity: "2024-01-19"
          },
          {
            id: "default-4",
            name: "فاطمة حسن",
            email: "fatima@example.com",
            phone: "+201234567893",
            totalPoints: 50,
            joinDate: "2024-01-20",
            status: "active",
            completedOffers: ["offer_1"],
            lastActivity: "2024-01-20"
          },
          {
            id: "default-5",
            name: "علي أحمد",
            email: "ali@example.com",
            phone: "+201234567894",
            totalPoints: 125,
            joinDate: "2024-01-12",
            status: "active",
            completedOffers: ["offer_1", "offer_2"],
            lastActivity: "2024-01-17"
          }
        ];
        return defaultParticipants;
      }
    } catch (error) {
      console.error("❌ Failed to fetch participants:", error);
      return rejectWithValue("فشل في جلب المشتركين");
    }
  }
);

// Add new participant to Firestore
export const addParticipant = createAsyncThunk(
  "participants/addParticipant",
  async (participantData: Omit<Participant, "id">, { rejectWithValue }) => {
    try {
      console.log("➕ Adding new participant to Firestore...");
      const participantsCollection = collection(firestore, "participants");

      // Clean up undefined values
      const cleanParticipantData = Object.fromEntries(
        Object.entries(participantData).filter(
          ([_, value]) => value !== undefined
        )
      );

      const newParticipant = {
        ...cleanParticipantData,
        joinDate: new Date().toISOString().split("T")[0],
        lastActivity: new Date().toISOString().split("T")[0]
      };

      const docRef = await addDoc(participantsCollection, newParticipant);
      const addedParticipant = { ...newParticipant, id: docRef.id };

      console.log("✅ Participant added successfully:", addedParticipant);
      return addedParticipant;
    } catch (error) {
      console.error("❌ Failed to add participant:", error);
      return rejectWithValue("فشل في إضافة المشترك");
    }
  }
);

// Update participant in Firestore
export const updateParticipant = createAsyncThunk(
  "participants/updateParticipant",
  async (
    {
      id,
      participantData
    }: { id: string; participantData: Partial<Participant> },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating participant in Firestore:", id);
      const participantDoc = doc(firestore, "participants", id);
      await updateDoc(participantDoc, participantData);

      console.log("✅ Participant updated successfully");
      return { id, ...participantData };
    } catch (error) {
      console.error("❌ Failed to update participant:", error);
      return rejectWithValue("فشل في تحديث المشترك");
    }
  }
);

// Delete participant from Firestore
export const deleteParticipant = createAsyncThunk(
  "participants/deleteParticipant",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🗑️ Deleting participant from Firestore:", id);
      const participantDoc = doc(firestore, "participants", id);
      await deleteDoc(participantDoc);

      console.log("✅ Participant deleted successfully");
      return id;
    } catch (error) {
      console.error("❌ Failed to delete participant:", error);
      return rejectWithValue("فشل في حذف المشترك");
    }
  }
);

// Update participant status in Firestore
export const updateParticipantStatus = createAsyncThunk(
  "participants/updateParticipantStatus",
  async (
    { id, status }: { id: string; status: "active" | "inactive" },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating participant status in Firestore:", id);
      const participantDoc = doc(firestore, "participants", id);
      await updateDoc(participantDoc, { status });

      console.log("✅ Participant status updated successfully");
      return { id, status };
    } catch (error) {
      console.error("❌ Failed to update participant status:", error);
      return rejectWithValue("فشل في تحديث حالة المشترك");
    }
  }
);

const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch participants
      .addCase(fetchParticipants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParticipants.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = action.payload;
      })
      .addCase(fetchParticipants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add participant
      .addCase(addParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addParticipant.fulfilled, (state, action) => {
        state.loading = false;
        state.participants.unshift(action.payload);
      })
      .addCase(addParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update participant
      .addCase(updateParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParticipant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.participants.findIndex(
          (participant) => participant.id === action.payload.id
        );
        if (index !== -1) {
          state.participants[index] = {
            ...state.participants[index],
            ...action.payload
          };
        }
      })
      .addCase(updateParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete participant
      .addCase(deleteParticipant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParticipant.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = state.participants.filter(
          (participant) => participant.id !== action.payload
        );
      })
      .addCase(deleteParticipant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update participant status
      .addCase(updateParticipantStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParticipantStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.participants.findIndex(
          (participant) => participant.id === action.payload.id
        );
        if (index !== -1) {
          state.participants[index].status = action.payload.status;
        }
      })
      .addCase(updateParticipantStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = participantsSlice.actions;
export default participantsSlice.reducer;
