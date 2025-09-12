import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
import { firestore, storage } from "../../lib/firebase"; // ✅ storage لازم يكون متعرف في firebase.ts
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export interface Offer {
  id: string;
  title: string;
  description: string;
  points: number;
  category: string;
  status: "active" | "inactive";
  completedCount: number;
  createdDate: string;
  imageUrl?: string;
}

interface OffersState {
  offers: Offer[];
  loading: boolean;
  error: string | null;
}

const initialState: OffersState = {
  offers: [],
  loading: false,
  error: null,
};

// 🔹 رفع صورة إلى Firebase Storage
const uploadImage = async (file: File): Promise<string> => {
  const storageRef = ref(storage, `offers/${Date.now()}-${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// Fetch offers from Firestore
export const fetchOffers = createAsyncThunk(
  "offers/fetchOffers",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching offers from Firestore...");
      const offersCollection = collection(firestore, "offers");
      const q = query(offersCollection, orderBy("createdDate", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const offersArray: Offer[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data();

          return {
            id: docSnap.id,
            title: data.title,
            description: data.description,
            points: data.points,
            category: data.category,
            status: data.status === "active" ? "active" : "inactive",
            completedCount: data.completedCount ?? 0,
            createdDate: data.createdDate ?? new Date().toISOString(),
            imageUrl: data.imageUrl ?? "",
          };
        });

        console.log("✅ Offers fetched successfully:", offersArray.length);
        return offersArray;
      } else {
        console.log("📝 No offers found, returning default data");
        const defaultOffers: Offer[] = [
          {
            id: "default-1",
            title: "اشترك في قناة تليجرام",
            description: "اشترك في قناتنا على تليجرام واحصل على 50 نقطة",
            points: 50,
            category: "social",
            status: "active",
            completedCount: 0,
            createdDate: new Date().toISOString(),
            imageUrl: "/images/telegram.png",
          },
          {
            id: "default-2",
            title: "تابع صفحة فيسبوك",
            description: "تابع صفحتنا على فيسبوك واحصل على 30 نقطة",
            points: 30,
            category: "social",
            status: "active",
            completedCount: 0,
            createdDate: new Date().toISOString(),
            imageUrl: "/images/facebook.png",
          },
        ];
        return defaultOffers;
      }
    } catch (error) {
      console.error("❌ Failed to fetch offers:", error);
      return rejectWithValue("فشل في جلب العروض");
    }
  }
);

// Add new offer to Firestore (يدعم رفع صورة)
export const addOffer = createAsyncThunk(
  "offers/addOffer",
  async (
    offerData: Omit<Offer, "id" | "completedCount" | "createdDate"> & {
      imageFile?: File;
    },
    { rejectWithValue }
  ) => {
    try {
      console.log("➕ Adding new offer to Firestore...");

      let imageUrl = offerData.imageUrl || "";
      if (offerData.imageFile) {
        imageUrl = await uploadImage(offerData.imageFile);
      }

      const newOffer: Omit<Offer, "id"> = {
        ...offerData,
        imageUrl,
        createdDate: new Date().toISOString(),
        completedCount: 0,
      };

      const offersCollection = collection(firestore, "offers");
      const docRef = await addDoc(offersCollection, newOffer);
      const addedOffer = { ...newOffer, id: docRef.id };

      console.log("✅ Offer added successfully:", addedOffer);
      return addedOffer;
    } catch (error) {
      console.error("❌ Failed to add offer:", error);
      return rejectWithValue("فشل في إضافة العرض");
    }
  }
);

// Update offer in Firestore (يدعم تحديث الصورة)
export const updateOffer = createAsyncThunk(
  "offers/updateOffer",
  async (
    { id, offerData }: { id: string; offerData: Partial<Offer> & { imageFile?: File } },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating offer in Firestore:", id);

      let updatedData = { ...offerData };

      if (offerData.imageFile) {
        const imageUrl = await uploadImage(offerData.imageFile);
        updatedData.imageUrl = imageUrl;
        delete updatedData.imageFile;
      }

      const offerDoc = doc(firestore, "offers", id);
      await updateDoc(offerDoc, updatedData);

      console.log("✅ Offer updated successfully");
      return { id, ...updatedData };
    } catch (error) {
      console.error("❌ Failed to update offer:", error);
      return rejectWithValue("فشل في تحديث العرض");
    }
  }
);

// Delete offer from Firestore
export const deleteOffer = createAsyncThunk(
  "offers/deleteOffer",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🗑️ Deleting offer from Firestore:", id);
      const offerDoc = doc(firestore, "offers", id);
      await deleteDoc(offerDoc);

      console.log("✅ Offer deleted successfully");
      return id;
    } catch (error) {
      console.error("❌ Failed to delete offer:", error);
      return rejectWithValue("فشل في حذف العرض");
    }
  }
);

// Toggle offer status in Firestore
export const toggleOfferStatus = createAsyncThunk(
  "offers/toggleOfferStatus",
  async (
    { id, currentStatus }: { id: string; currentStatus: "active" | "inactive" },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Toggling offer status in Firestore:", id);
      const offerDoc = doc(firestore, "offers", id);
      const newStatus: "active" | "inactive" =
        currentStatus === "active" ? "inactive" : "active";

      await updateDoc(offerDoc, { status: newStatus });

      console.log("✅ Offer status toggled successfully");
      return { id, status: newStatus };
    } catch (error) {
      console.error("❌ Failed to toggle offer status:", error);
      return rejectWithValue("فشل في تغيير حالة العرض");
    }
  }
);

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch offers
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add offer
      .addCase(addOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers.unshift(action.payload);
      })
      .addCase(addOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update offer
      .addCase(updateOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.offers.findIndex(
          (offer) => offer.id === action.payload.id
        );
        if (index !== -1) {
          state.offers[index] = { ...state.offers[index], ...action.payload };
        }
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete offer
      .addCase(deleteOffer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = state.offers.filter(
          (offer) => offer.id !== action.payload
        );
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle offer status
      .addCase(toggleOfferStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleOfferStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.offers.findIndex(
          (offer) => offer.id === action.payload.id
        );
        if (index !== -1) {
          state.offers[index].status = action.payload.status;
        }
      })
      .addCase(toggleOfferStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = offersSlice.actions;
export default offersSlice.reducer;
