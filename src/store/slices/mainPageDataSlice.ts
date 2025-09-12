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
  where
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";

export interface MainPageData {
  id: string;
  title: string;
  description: string;
  category: string;
  value: string;
  icon: string;
  isActive: boolean;
  currentParticipations: number;
  maxParticipations: number;
  requirements: string[];
  reward: number;
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
  createdAt: string;
  updatedAt: string;
}

interface MainPageDataState {
  mainPageData: MainPageData[];
  loading: boolean;
  error: string | null;
}

const initialState: MainPageDataState = {
  mainPageData: [],
  loading: false,
  error: null
};

// Fetch main page data from Firestore
export const fetchMainPageData = createAsyncThunk(
  "mainPageData/fetchMainPageData",
  async (_, { rejectWithValue }) => {
    try {
      console.log("🔍 Fetching main page data from Firestore...");
      const dataCollection = collection(firestore, "mainPageData");
      const q = query(dataCollection, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const dataArray: MainPageData[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          // Convert Firestore Timestamp objects to ISO strings
          const createdAt = data.createdAt?.toDate?.()
            ? data.createdAt.toDate().toISOString()
            : data.createdAt;
          const updatedAt = data.updatedAt?.toDate?.()
            ? data.updatedAt.toDate().toISOString()
            : data.updatedAt;

          return {
            id: doc.id,
            ...data,
            createdAt,
            updatedAt
          };
        }) as MainPageData[];

        console.log(
          "✅ Main page data fetched successfully:",
          dataArray.length
        );
        return dataArray;
      } else {
        // Return default main page data if no data exists
        console.log("📝 No main page data found, returning default data");
        const defaultMainPageData: MainPageData[] = [
          {
            id: "default-1",
            title: "اشتراك تجريبي مجاني",
            description: "جرب الخدمة لمدة 7 أيام مجانا",
            category: "Services",
            value: "$29.99",
            icon: "🎁",
            isActive: true,
            currentParticipations: 156,
            maxParticipations: 200,
            requirements: [
              "التسجيل بالبريد الإلكتروني",
              "تأكيد البريد الإلكتروني",
              "استكشاف المنصة"
            ],
            reward: 3,
            estimatedTime: 10,
            difficulty: "easy",
            createdAt: "2024-01-15T10:00:00.000Z",
            updatedAt: "2024-01-15T10:00:00.000Z"
          },
          {
            id: "default-2",
            title: "MacBook Air M3",
            description: "لابتوب خفيف وسريع مع شريحة M3",
            category: "Electronics",
            value: "$1,299",
            icon: "💻",
            isActive: true,
            currentParticipations: 45,
            maxParticipations: 80,
            requirements: [
              "مشاركة على وسائل التواصل الاجتماعي",
              "دعوة 3 أصدقاء",
              "مشاهدة الفيديو التعريفي"
            ],
            reward: 5,
            estimatedTime: 15,
            difficulty: "medium",
            createdAt: "2024-01-10T14:00:00.000Z",
            updatedAt: "2024-01-10T14:00:00.000Z"
          },
          {
            id: "default-3",
            title: "جائزة نقدية",
            description: "فوز بجائزة نقدية قيمة",
            category: "Cash",
            value: "$2,000",
            icon: "💰",
            isActive: true,
            currentParticipations: 89,
            maxParticipations: 100,
            requirements: [
              "إكمال الملف الشخصي",
              "المشاركة في 5 عروض",
              "تقييم الخدمة"
            ],
            reward: 10,
            estimatedTime: 20,
            difficulty: "hard",
            createdAt: "2024-01-05T16:00:00.000Z",
            updatedAt: "2024-01-05T16:00:00.000Z"
          }
        ];
        return defaultMainPageData;
      }
    } catch (error) {
      console.error("❌ Failed to fetch main page data:", error);
      return rejectWithValue("فشل في جلب بيانات الصفحة الرئيسية");
    }
  }
);

// Add new main page data to Firestore
export const addMainPageData = createAsyncThunk(
  "mainPageData/addMainPageData",
  async (data: Omit<MainPageData, "id">, { rejectWithValue }) => {
    try {
      console.log("➕ Adding new main page data to Firestore...");
      const dataCollection = collection(firestore, "mainPageData");

      const newData = {
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const docRef = await addDoc(dataCollection, newData);
      const addedData = { ...newData, id: docRef.id };

      console.log("✅ Main page data added successfully:", addedData);
      return addedData;
    } catch (error) {
      console.error("❌ Failed to add main page data:", error);
      return rejectWithValue("فشل في إضافة بيانات الصفحة الرئيسية");
    }
  }
);

// Update main page data in Firestore
export const updateMainPageData = createAsyncThunk(
  "mainPageData/updateMainPageData",
  async (
    { id, data }: { id: string; data: Partial<MainPageData> },
    { rejectWithValue }
  ) => {
    try {
      console.log("🔄 Updating main page data in Firestore:", id);
      const dataDoc = doc(firestore, "mainPageData", id);
      const updateData = {
        ...data,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(dataDoc, updateData);

      console.log("✅ Main page data updated successfully");
      return { id, ...updateData };
    } catch (error) {
      console.error("❌ Failed to update main page data:", error);
      return rejectWithValue("فشل في تحديث بيانات الصفحة الرئيسية");
    }
  }
);

// Delete main page data from Firestore
export const deleteMainPageData = createAsyncThunk(
  "mainPageData/deleteMainPageData",
  async (id: string, { rejectWithValue }) => {
    try {
      console.log("🗑️ Deleting main page data from Firestore:", id);
      const dataDoc = doc(firestore, "mainPageData", id);
      await deleteDoc(dataDoc);

      console.log("✅ Main page data deleted successfully");
      return id;
    } catch (error) {
      console.error("❌ Failed to delete main page data:", error);
      return rejectWithValue("فشل في حذف بيانات الصفحة الرئيسية");
    }
  }
);

// Toggle active status
export const toggleActiveStatus = createAsyncThunk(
  "mainPageData/toggleActiveStatus",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      console.log("🔄 Toggling active status in Firestore:", id);
      const state = getState() as { mainPageData: MainPageDataState };
      const currentData = state.mainPageData.mainPageData.find(
        (item) => item.id === id
      );

      if (!currentData) {
        throw new Error("Data not found");
      }

      const dataDoc = doc(firestore, "mainPageData", id);
      const newStatus = !currentData.isActive;
      await updateDoc(dataDoc, {
        isActive: newStatus,
        updatedAt: new Date().toISOString()
      });

      console.log("✅ Active status toggled successfully");
      return { id, isActive: newStatus };
    } catch (error) {
      console.error("❌ Failed to toggle active status:", error);
      return rejectWithValue("فشل في تغيير حالة النشاط");
    }
  }
);

const mainPageDataSlice = createSlice({
  name: "mainPageData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch main page data
      .addCase(fetchMainPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMainPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.mainPageData = action.payload;
      })
      .addCase(fetchMainPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Add main page data
      .addCase(addMainPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMainPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.mainPageData.unshift(action.payload);
      })
      .addCase(addMainPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update main page data
      .addCase(updateMainPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMainPageData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mainPageData.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.mainPageData[index] = {
            ...state.mainPageData[index],
            ...action.payload
          };
        }
      })
      .addCase(updateMainPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete main page data
      .addCase(deleteMainPageData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMainPageData.fulfilled, (state, action) => {
        state.loading = false;
        state.mainPageData = state.mainPageData.filter(
          (item) => item.id !== action.payload
        );
      })
      .addCase(deleteMainPageData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle active status
      .addCase(toggleActiveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleActiveStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.mainPageData.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.mainPageData[index].isActive = action.payload.isActive;
          state.mainPageData[index].updatedAt = new Date().toISOString();
        }
      })
      .addCase(toggleActiveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = mainPageDataSlice.actions;
export default mainPageDataSlice.reducer;




