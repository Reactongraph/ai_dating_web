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
import { rtkQueryErrorLogger } from './middleware/rtkQueryErrorLogger';

// Configure auth reducer persistence - exclude transient fields
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated', 'realtimeImage'], // Only persist these fields
  // Exclude: loading, requiresVerification, error (these are transient)
};

// Configure characterAttributes persistence
const characterAttributesPersistConfig = {
  key: 'characterAttributes',
  storage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  characterAttributes: persistReducer(characterAttributesPersistConfig, characterAttributesReducer),
  [authApi.reducerPath]: authApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [googleAuthApi.reducerPath]: googleAuthApi.reducer,
  [characterAttributesApi.reducerPath]: characterAttributesApi.reducer,
  [botProfilesApi.reducerPath]: botProfilesApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      rtkQueryErrorLogger, // Add error logger first to catch all errors
      authApi.middleware,
      profileApi.middleware,
      googleAuthApi.middleware,
      characterAttributesApi.middleware,
      botProfilesApi.middleware,
      chatApi.middleware,
    ),
});

export const persistor = persistStore(store);

// Enable refetchOnFocus and refetchOnReconnect
setupListeners(store.dispatch);

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
