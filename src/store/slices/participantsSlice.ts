import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

// ==================== Types ====================
export interface Participant {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  totalPoints?: number;
  joinDate?: string;
  status: "pending" | "accepted" | "rejected";
  completedOffers?: string[];
  lastActivity?: string;
  socialMediaLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
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
  error: null,
};

// ==================== Thunks ====================

// Fetch participants from Firestore
export const fetchParticipants = createAsyncThunk(
  "participants/fetchParticipants",
  async (_, { rejectWithValue }) => {
    try {
      const participantsCollection = collection(firestore, "participants");
      const q = query(participantsCollection, orderBy("joinDate", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const participantsArray: Participant[] = querySnapshot.docs.map(
          (docSnap) => {
            const data = docSnap.data();
            return {
              id: docSnap.id,
              ...data,
              status: (data.status as "pending" | "accepted" | "rejected") || "pending",
            };
          }
        );
        return participantsArray;
      } else {
        return [];
      }
    } catch (error) {
      console.error("❌ Failed to fetch participants:", error);
      return rejectWithValue("فشل في جلب المشتركين");
    }
  }
);

// Add new participant
export const addParticipant = createAsyncThunk(
  "participants/addParticipant",
  async (participantData: Omit<Participant, "id">, { rejectWithValue }) => {
    try {
      const participantsCollection = collection(firestore, "participants");

      const cleanParticipantData = Object.fromEntries(
        Object.entries(participantData).filter(
          ([, value]) => value !== undefined
        )
      );

      const newParticipant: Omit<Participant, "id"> = {
        ...cleanParticipantData,
        status: "pending",
        joinDate: new Date().toISOString().split("T")[0],
        lastActivity: new Date().toISOString().split("T")[0],
      };

      const docRef = await addDoc(participantsCollection, newParticipant);
      return { ...newParticipant, id: docRef.id };
    } catch (error) {
      console.error("❌ Failed to add participant:", error);
      return rejectWithValue("فشل في إضافة المشترك");
    }
  }
);

// Update participant
export const updateParticipant = createAsyncThunk(
  "participants/updateParticipant",
  async (
    { id, participantData }: { id: string; participantData: Partial<Participant> },
    { rejectWithValue }
  ) => {
    try {
      const participantDoc = doc(firestore, "participants", id);
      await updateDoc(participantDoc, participantData);
      return { id, ...participantData };
    } catch (error) {
      console.error("❌ Failed to update participant:", error);
      return rejectWithValue("فشل في تحديث المشترك");
    }
  }
);

// Delete participant
export const deleteParticipant = createAsyncThunk(
  "participants/deleteParticipant",
  async (id: string, { rejectWithValue }) => {
    try {
      const participantDoc = doc(firestore, "participants", id);
      await deleteDoc(participantDoc);
      return id;
    } catch (error) {
      console.error("❌ Failed to delete participant:", error);
      return rejectWithValue("فشل في حذف المشترك");
    }
  }
);

// Update participant status
export const updateParticipantStatus = createAsyncThunk(
  "participants/updateParticipantStatus",
  async (
    { id, status }: { id: string; status: "pending" | "accepted" | "rejected" },
    { rejectWithValue }
  ) => {
    try {
      const participantDoc = doc(firestore, "participants", id);
      await updateDoc(participantDoc, { status });
      return { id, status };
    } catch (error) {
      console.error("❌ Failed to update participant status:", error);
      return rejectWithValue("فشل في تحديث حالة المشترك");
    }
  }
);

// ==================== Slice ====================
const participantsSlice = createSlice({
  name: "participants",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setParticipants: (state, action: PayloadAction<Participant[]>) => {
      state.participants = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
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
      // Add
      .addCase(addParticipant.fulfilled, (state, action) => {
        state.loading = false;
        state.participants.unshift(action.payload);
      })
      // Update
      .addCase(updateParticipant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.participants.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.participants[index] = {
            ...state.participants[index],
            ...action.payload,
          };
        }
      })
      // Delete
      .addCase(deleteParticipant.fulfilled, (state, action) => {
        state.loading = false;
        state.participants = state.participants.filter(
          (p) => p.id !== action.payload
        );
      })
      // Update Status
      .addCase(updateParticipantStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.participants.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.participants[index].status =
            action.payload.status as "pending" | "accepted" | "rejected";
        }
      });
  },
});

export const { clearError, setParticipants } = participantsSlice.actions;
export default participantsSlice.reducer;
