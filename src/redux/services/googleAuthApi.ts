import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface GoogleAuthRequest {
  token: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;
}

interface GoogleAuthResponse {
  statusCode?: number;
  message?: string;
  accessToken?:
    | {
        access_token: string;
      }
    | string;
  user?: {
    _id: string;
    name: string;
    email: string;
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
      isPlusSubscriber: boolean;
      isBoostSubscriber: boolean;
      isSuperLikeSubscriber: boolean;
    };
    isPremiumSubscriber?: boolean;
    incognitoMode?: boolean;
    profilePicture?: string;
    [key: string]: unknown;
  };
  realtimeImage?: string[];
  success?: boolean;
  token?: string;
  email?: string;
  name?: string;
  picture?: string;
  googleId?: string;
}

export const googleAuthApi = createApi({
  reducerPath: 'googleAuthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    validateStatus: (response, body) => {
      // Treat 304 Not Modified as successful (cached data is still valid)
      return (response.status >= 200 && response.status < 300) || response.status === 304;
    },
  }),
  endpoints: (builder) => ({
    googleLogin: builder.mutation<GoogleAuthResponse, GoogleAuthRequest>({
      query: (credentials) => ({
        url: '/auth/google/callback',
        method: 'POST',
        body: credentials,
      }),
    }),
    verifySession: builder.mutation<
      GoogleAuthResponse,
      { sessionToken: string; email: string; userId: string }
    >({
      query: (sessionData) => ({
        url: '/auth/verify-session',
        method: 'POST',
        body: sessionData,
      }),
    }),
  }),
});

export const { useGoogleLoginMutation, useVerifySessionMutation } =
  googleAuthApi;
