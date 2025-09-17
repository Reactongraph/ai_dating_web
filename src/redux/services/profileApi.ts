import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { LoginResponse } from './authApi';

export interface UpdateProfileRequest {
  name?: string;
  gender?: 'man' | 'woman' | 'other';
  dateOfBirth?: string;
  aboutMe?: string;
  profilePicture?: File | string; // For file uploads
}

export interface UpdateProfileResponse {
  statusCode?: number;
  message?: string;
  success?: boolean;
  user?: LoginResponse['user'];
}

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state or localStorage
      const token =
        (getState() as { auth: { token: string | null } }).auth.token ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('accessToken')
          : null);

      // If token exists, add authorization header
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    getProfile: builder.query<LoginResponse['user'], void>({
      query: () => '/users/profile',
      providesTags: ['Profile'],
    }),

    updateProfile: builder.mutation<
      UpdateProfileResponse,
      UpdateProfileRequest
    >({
      query: (profileData) => {
        // Handle file uploads with FormData if needed
        const formData = new FormData();

        Object.entries(profileData).forEach(([key, value]) => {
          if (value !== undefined) {
            if (key === 'profilePicture' && value instanceof File) {
              formData.append('profilePicture', value);
            } else {
              formData.append(key, String(value));
            }
          }
        });

        return {
          url: '/users/profile',
          method: 'PUT',
          body: formData,
          // Don't set Content-Type header when using FormData
          // It will be set automatically with the correct boundary
        };
      },
      invalidatesTags: ['Profile'],
    }),

    uploadProfilePicture: builder.mutation<
      { success: boolean; url: string; message: string },
      File
    >({
      query: (file) => {
        const formData = new FormData();
        formData.append('profilePicture', file);

        return {
          url: '/users/profile-picture',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadProfilePictureMutation,
} = profileApi;
