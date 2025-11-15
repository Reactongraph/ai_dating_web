import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginResponse } from './authApi';

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: number;
  countryCode?: number;
  birthDate?: string; // ISO date string or Date
  gender?: 'man' | 'woman' | 'other';
  aboutMe?: string;
  university?: string;
  city?: string;
  height?: number;
  sexualOrientation?: number[];
  showMe?: boolean;
  sexualInterest?: number;
  interest?: number[];
  zodiac?: number;
  location?: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  maxDistance?: {
    distance: number;
  };
  ageRange?: {
    minAge: number;
    maxAge: number;
  };
}

export interface ProfileImage {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  destination?: string;
  filename?: string;
  path?: string;
  size?: number;
  s3Location?: string; // Full S3 URL
  s3Key?: string; // S3 key
  url?: string; // Alternative field name for URL
}

export interface UpdateProfileResponse {
  statusCode: number;
  message: string;
  user: LoginResponse['user'] & {
    profileImageUrl?: string;
  };
  realtimeImage?: unknown;
  profileImage?: ProfileImage;
}

export interface GetProfileResponse {
  statusCode: number;
  message: string;
  user: LoginResponse['user'] & {
    profileImage?: ProfileImage;
    profileImageUrl?: string;
  };
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
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
    validateStatus: response => {
      // Treat 304 Not Modified as successful (cached data is still valid)
      return (response.status >= 200 && response.status < 300) || response.status === 304;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: builder => ({
    getProfile: builder.query<GetProfileResponse, string>({
      query: userId => `/users/get/${userId}`,
      providesTags: ['Profile'],
      transformResponse: (response: GetProfileResponse) => {
        // Return the response as-is since it already has the correct structure
        return response;
      },
    }),

    updateProfile: builder.mutation<
      UpdateProfileResponse,
      { userId: string; data: UpdateProfileRequest }
    >({
      query: ({ userId, data }) => {
        return {
          url: `/users/update/${userId}`,
          method: 'PATCH',
          body: data,
        };
      },
      invalidatesTags: ['Profile'],
    }),

    uploadProfilePicture: builder.mutation<UpdateProfileResponse, { userId: string; file: File }>({
      query: ({ userId, file }) => {
        const formData = new FormData();
        formData.append('profileImage', file);

        return {
          url: `/users/update-profile-image/${userId}`,
          method: 'PATCH',
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation, useUploadProfilePictureMutation } =
  profileApi;
