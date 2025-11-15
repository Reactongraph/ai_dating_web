import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define types for auth endpoints based on the provided API format
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  statusCode?: number;
  message?: string;
  accessToken?: {
    access_token: string;
  };
  user?: {
    _id: string;
    id?: string; // Normalized field - always set to same value as _id
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
    [key: string]: unknown; // For any additional user fields
  };
  realtimeImage?: string[];
  success?: boolean; // Added for backward compatibility
  requiresVerification?: boolean; // Added for backward compatibility
}

export interface SignupRequest {
  firstName: string;
  email: string;
  password: string;
  phone?: number;
  countryCode?: number;
  birthDate?: string;
  gender?: 'man' | 'woman' | 'other';
}

export interface SignupResponse {
  statusCode: number;
  message: string;
  emailSent?: boolean;
  userId?: string;
  success?: boolean; // For backward compatibility
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state or localStorage
      const token =
        (getState() as { auth: { token: string | null } }).auth.token ||
        (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

      // If token exists, add authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
    validateStatus: (response, body) => {
      // Treat 304 Not Modified as successful (cached data is still valid)
      return (response.status >= 200 && response.status < 300) || response.status === 304;
    },
  }),
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/users/email-login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: userData => ({
        url: '/users/email-signup',
        method: 'POST',
        body: userData,
      }),
    }),
    logout: builder.mutation<{ success: boolean }, void>({
      query: () => ({
        url: '/users/logout',
        method: 'POST',
      }),
    }),
    verifyToken: builder.query<{ valid: boolean; user?: LoginResponse['user'] }, void>({
      query: () => '/api/users/verify-token',
    }),
  }),
});

// Export hooks for using the API endpoints
export const { useLoginMutation, useSignupMutation, useLogoutMutation, useVerifyTokenQuery } =
  authApi;
