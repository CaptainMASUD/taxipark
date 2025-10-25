import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // 'en' | 'ru'
  code: "en",
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage(state, action) {
      state.code = action.payload; // expect 'en' or 'ru'
    },
    toggleLanguage(state) {
      state.code = state.code === "en" ? "ru" : "en";
    },
  },
});

export const { setLanguage, toggleLanguage } = languageSlice.actions;

// Selector
export const selectLanguageCode = (state) => state.language.code;

export default languageSlice.reducer;
