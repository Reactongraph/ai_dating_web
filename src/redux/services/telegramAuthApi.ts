import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface TelegramAuthRequest {
  initData: string;
  parsedData?: {
    user?: {
      id: string;
      first_name?: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
      is_premium?: boolean;
    };
    auth_date?: number;
    hash?: string;
    query_id?: string;
    start_param?: string;
  };
}

interface TelegramAuthResponse {
  statusCode?: number;
  message?: string;
  accessToken?:
    | {
        access_token: string;
      }
    | string;
  user?: {
    _id: string;
    id?: string; // Normalized field - always set to same value as _id
    name: string;
    email: string; // Always present - backend generates unique internal email for Telegram users
    onlineStatus?: string;
    isNewUser?: boolean;
    isPhoneVerified?: boolean;
    isEmailVerified?: boolean;
    isRealTimeImageVerified?: boolean;
    isProfileVerified?: boolean;
    location?: {
      type: string;
      coordinates: number[];
    };
    aboutMe?: string;
    city?: string;
    height?: number;
    likeCount?: number;
    subscriber?: {
      isPremiumSubscriber: boolean;
    };
    subscriptionDetails?: {
      planId: string;
      planValidity: number; // in months
      startDate: string;
      expiryDate: string;
      isActive: boolean;
      reminderSent: boolean;
    };
    isPremiumSubscriber?: boolean;
    incognitoMode?: boolean;
    profilePicture?: string;
    telegramId?: string;
    [key: string]: unknown;
  };
  realtimeImage?: string[];
  success?: boolean;
  token?: string;
}

export const telegramAuthApi = createApi({
  reducerPath: 'telegramAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    validateStatus: (response, body) => {
      // Treat 304 Not Modified as successful (cached data is still valid)
      return (response.status >= 200 && response.status < 300) || response.status === 304;
    },
  }),
  endpoints: builder => ({
    telegramLogin: builder.mutation<TelegramAuthResponse, TelegramAuthRequest>({
      query: credentials => ({
        url: '/auth/telegram/callback',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useTelegramLoginMutation } = telegramAuthApi;
