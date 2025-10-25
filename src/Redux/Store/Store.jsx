// src/store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userReducer from "../UserSlice/userSlice";
import languageReducer from "../LanguageSlice/languageSlice";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

const rootReducer = combineReducers({
  user: userReducer,
  language: languageReducer, 
});

const persistConfig = {
  key: "root",
  storage,
  // (optional) blacklist/whitelist if needed
  // whitelist: ['language', 'user']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
