import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface BotProfile {
  _id: string;
  name: string;
  age: string;
  bio: string;
  bot_type: 'girl' | 'boy' | 'anime';
  style: string;
  ethnicity: string;
  eye_color: string;
  hair_style: string;
  hair_color: string;
  body_type: string;
  breast_size?: string;
  butt_size?: string;
  personality: string;
  occupation: string;
  hobbies: string[];
  relationship: string;
  clothing: string;
  imageURL: string;
  avatar_image?: {
    s3Location: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface GetBotProfilesResponse {
  statusCode: number;
  botProfiles: BotProfile[];
}

export const botProfilesApi = createApi({
  reducerPath: 'botProfilesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as { auth: { token: string | null } }).auth
        .token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    validateStatus: (response, body) => {
      // Treat 304 Not Modified as successful (cached data is still valid)
      // Also treat any 2xx status as successful
      return (response.status >= 200 && response.status < 300) || response.status === 304;
    },
  }),
  tagTypes: ['BotProfiles'],
  endpoints: (builder) => ({
    getBotProfiles: builder.query<GetBotProfilesResponse, string>({
      query: (botType) =>
        `/botProfiles/get-all-default-bot-profiles/${botType}`,
      providesTags: (result, error, botType) => [
        { type: 'BotProfiles', id: botType },
      ],
    }),
    getUserBotProfiles: builder.query<GetBotProfilesResponse, void>({
      query: () => '/users/bot-profiles',
      providesTags: [{ type: 'BotProfiles', id: 'user' }],
    }),
  }),
});

export const { useGetBotProfilesQuery, useGetUserBotProfilesQuery } =
  botProfilesApi;
