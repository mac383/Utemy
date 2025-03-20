import { createSlice } from "@reduxjs/toolkit";
import { getThemeFromLocalStorage } from "../utils/functions";

const initialState = {
  userId: null,
  fullName: null,
  email: null,
  userName: null,
  password: null,
  profileImageURL: null,
  profileImageName: null,
  registrationDate: null,
  branchId: null,
  branchName: null,
  settings: {
    theme: getThemeFromLocalStorage() || "light", // light | dark default theme is light.
  },
};

const currentUserReducer = createSlice({
  name: "current_user",
  initialState: initialState,
  reducers: {
    resetCurrentUser: (currentState) => {
      const settingsBackup = { ...currentState.settings }; // الاحتفاظ بالإعدادات الحالية
      Object.assign(currentState, initialState); // إعادة تعيين الحالة إلى القيم الابتدائية
      currentState.settings = settingsBackup; // استعادة الإعدادات
    },
    setCurrentUser: (currentState, action) => {
      // استثناء الإعدادات من عملية النسخ
      const { settings, ...restPayload } = action.payload;
      Object.assign(currentState, restPayload);
    },
    updateField: (currentState, action) => {
      const { field, value } = action.payload;
      if (field in currentState) {
        currentState[field] = value;
      }
    },
    setSettings: (currentState, action) => {
      // تحديث الإعدادات فقط
      currentState.settings = {
        ...currentState.settings,
        ...action.payload.settings,
      };
    },
  },
});

export const { resetCurrentUser, setCurrentUser, updateField, setSettings } =
  currentUserReducer.actions;

export default currentUserReducer.reducer;
