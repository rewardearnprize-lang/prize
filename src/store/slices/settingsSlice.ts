import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ref, get, set, update } from "firebase/database";
import { database } from "@/lib/firebase";

export interface AppSettings {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
    tiktok: string;
  };
  features: {
    referralSystem: boolean;
    socialMediaVerification: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
  points: {
    offerCompletion: number;
    referralBonus: number;
    socialMediaShare: number;
    dailyLogin: number;
  };
  limits: {
    maxOffersPerDay: number;
    maxReferralsPerUser: number;
    minAge: number;
    maxAge: number;
  };
  maintenance: {
    isMaintenanceMode: boolean;
    maintenanceMessage: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  updatedAt: string;
}

interface SettingsState {
  settings: AppSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null
};

// Default settings
const defaultSettings: AppSettings = {
  siteName: "Prize Quest Connect",
  siteDescription: "منصة الربط للجوائز والعروض",
  contactEmail: "info@prizequest.com",
  contactPhone: "+966500000000",
  socialMedia: {
    facebook: "https://facebook.com/prizequest",
    instagram: "https://instagram.com/prizequest",
    twitter: "https://twitter.com/prizequest",
    tiktok: "https://tiktok.com/@prizequest"
  },
  features: {
    referralSystem: true,
    socialMediaVerification: true,
    emailNotifications: true,
    smsNotifications: false
  },
  points: {
    offerCompletion: 10,
    referralBonus: 5,
    socialMediaShare: 2,
    dailyLogin: 1
  },
  limits: {
    maxOffersPerDay: 10,
    maxReferralsPerUser: 5,
    minAge: 18,
    maxAge: 65
  },
  maintenance: {
    isMaintenanceMode: false,
    maintenanceMessage: "الموقع تحت الصيانة، يرجى المحاولة لاحقاً"
  },
  theme: {
    primaryColor: "#6366f1",
    secondaryColor: "#8b5cf6",
    accentColor: "#f59e0b"
  },
  updatedAt: new Date().toISOString()
};

// Async thunks for Firebase operations
export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async (_, { rejectWithValue }) => {
    try {
      const settingsRef = ref(database, "settings");
      const snapshot = await get(settingsRef);

      if (snapshot.exists()) {
        return snapshot.val();
      } else {
        // Initialize with default settings if none exist
        await set(settingsRef, defaultSettings);
        return defaultSettings;
      }
    } catch (error) {
      return rejectWithValue("فشل في جلب الإعدادات");
    }
  }
);

export const updateSettings = createAsyncThunk(
  "settings/updateSettings",
  async (settingsData: Partial<AppSettings>, { rejectWithValue }) => {
    try {
      const settingsRef = ref(database, "settings");
      const updateData = {
        ...settingsData,
        updatedAt: new Date().toISOString()
      };
      await update(settingsRef, updateData);
      return updateData;
    } catch (error) {
      return rejectWithValue("فشل في تحديث الإعدادات");
    }
  }
);

export const resetSettings = createAsyncThunk(
  "settings/resetSettings",
  async (_, { rejectWithValue }) => {
    try {
      const settingsRef = ref(database, "settings");
      await set(settingsRef, defaultSettings);
      return defaultSettings;
    } catch (error) {
      return rejectWithValue("فشل في إعادة تعيين الإعدادات");
    }
  }
);

export const toggleMaintenanceMode = createAsyncThunk(
  "settings/toggleMaintenance",
  async (
    {
      isMaintenanceMode,
      message
    }: { isMaintenanceMode: boolean; message?: string },
    { rejectWithValue }
  ) => {
    try {
      const settingsRef = ref(database, "settings/maintenance");
      await update(settingsRef, {
        isMaintenanceMode,
        maintenanceMessage:
          message || "الموقع تحت الصيانة، يرجى المحاولة لاحقاً"
      });
      return {
        isMaintenanceMode,
        maintenanceMessage:
          message || "الموقع تحت الصيانة، يرجى المحاولة لاحقاً"
      };
    } catch (error) {
      return rejectWithValue("فشل في تغيير وضع الصيانة");
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch settings
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update settings
      .addCase(updateSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSettings.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings = { ...state.settings, ...action.payload };
        }
      })
      .addCase(updateSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Reset settings
      .addCase(resetSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(resetSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle maintenance
      .addCase(toggleMaintenanceMode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleMaintenanceMode.fulfilled, (state, action) => {
        state.loading = false;
        if (state.settings) {
          state.settings.maintenance = {
            ...state.settings.maintenance,
            ...action.payload
          };
        }
      })
      .addCase(toggleMaintenanceMode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearError } = settingsSlice.actions;
export default settingsSlice.reducer;
