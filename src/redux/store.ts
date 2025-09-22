import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { authApi } from './services/authApi';
import { profileApi } from './services/profileApi';
import { googleAuthApi } from './services/googleAuthApi';
import { characterAttributesApi } from './services/characterAttributesApi';
import { botProfilesApi } from './services/botProfilesApi';
import { chatApi } from './services/chatApi';

import authReducer from './slices/authSlice';
import characterAttributesReducer from './slices/characterAttributesSlice';

// Configure Redux Persist
const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'characterAttributes'], // Only persist these reducers
};

const rootReducer = combineReducers({
  auth: authReducer,
  characterAttributes: characterAttributesReducer,
  [authApi.reducerPath]: authApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [googleAuthApi.reducerPath]: googleAuthApi.reducer,
  [characterAttributesApi.reducerPath]: characterAttributesApi.reducer,
  [botProfilesApi.reducerPath]: botProfilesApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      profileApi.middleware,
      googleAuthApi.middleware,
      characterAttributesApi.middleware,
      botProfilesApi.middleware,
      chatApi.middleware
    ),
});

export const persistor = persistStore(store);

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
