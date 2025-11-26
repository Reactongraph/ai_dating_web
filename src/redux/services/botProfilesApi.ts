import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface CollectionImage {
  imageURL: string;
  avatar_image?: {
    fieldname?: string;
    originalname?: string;
    encoding?: string;
    mimetype?: string;
    destination?: string;
    filename?: string;
    path?: string;
    size?: number;
    s3Location?: string;
    _id?: string;
  };
  prompt?: string;
  imageType?: 'sfw' | 'nsfw';
  context?: string;
  isPrimary?: boolean;
  createdAt?: string;
}

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
  isLiked?: boolean; // Added to track if bot is liked by current user
  collectionImages?: CollectionImage[]; // Collection images for liked bots
  totalImages?: number; // Total number of collection images
  imageType?: 'sfw' | 'nsfw';
}

export interface GetBotProfilesResponse {
  statusCode: number;
  botProfiles: BotProfile[];
}

export interface LikeBotResponse {
  statusCode: number;
  message: string;
}

export interface GetLikedBotsResponse {
  statusCode: number;
  message: string;
  total: number;
  likedBots: string[]; // Array of bot IDs
  botProfiles: BotProfile[]; // Array of bot profiles with collection images
}

export const botProfilesApi = createApi({
  reducerPath: 'botProfilesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      // Get auth state from Redux
      const authState = (getState() as { auth: { token: string | null; isAuthenticated: boolean } })
        .auth;

      // Get token from Redux state or localStorage as fallback
      const token =
        authState.token ||
        (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

      // Only add authorization header if user is logged in (has token and is authenticated)
      // Check both isAuthenticated flag and token existence to ensure user is truly logged in
      if (token && authState.isAuthenticated) {
        headers.set('authorization', `Bearer ${token}`);
      }

      return headers;
    },
    validateStatus: response => {
      // Treat 304 Not Modified as successful (cached data is still valid)
      // Also treat any 2xx status as successful
      return (response.status >= 200 && response.status < 300) || response.status === 304;
    },
  }),
  tagTypes: ['BotProfiles'],
  endpoints: builder => ({
    getBotProfiles: builder.query<GetBotProfilesResponse, string>({
      query: botType => `/botProfiles/get-all-default-bot-profiles/${botType}`,
      providesTags: (result, error, botType) => [{ type: 'BotProfiles', id: botType }],
    }),
    getUserBotProfiles: builder.query<GetBotProfilesResponse, void>({
      query: () => '/users/bot-profiles',
      providesTags: [{ type: 'BotProfiles', id: 'user' }],
    }),
    likeBot: builder.mutation<LikeBotResponse, string>({
      query: botId => ({
        url: `/users/like-bot/${botId}`,
        method: 'PATCH',
      }),
      invalidatesTags: () => [
        { type: 'BotProfiles', id: 'LIST' },
        { type: 'BotProfiles', id: 'user' },
        { type: 'BotProfiles', id: 'liked' },
        { type: 'BotProfiles', id: 'girl' },
        { type: 'BotProfiles', id: 'boy' },
        { type: 'BotProfiles', id: 'anime' },
      ],
    }),
    unlikeBot: builder.mutation<LikeBotResponse, string>({
      query: botId => ({
        url: `/users/unlike-bot/${botId}`,
        method: 'PATCH',
      }),
      invalidatesTags: () => [
        { type: 'BotProfiles', id: 'LIST' },
        { type: 'BotProfiles', id: 'user' },
        { type: 'BotProfiles', id: 'liked' },
        { type: 'BotProfiles', id: 'girl' },
        { type: 'BotProfiles', id: 'boy' },
        { type: 'BotProfiles', id: 'anime' },
      ],
    }),
    getLikedBots: builder.query<GetLikedBotsResponse, void>({
      query: () => '/users/liked-bots',
      providesTags: [{ type: 'BotProfiles', id: 'liked' }],
    }),
  }),
});

export const {
  useGetBotProfilesQuery,
  useGetUserBotProfilesQuery,
  useLikeBotMutation,
  useUnlikeBotMutation,
  useGetLikedBotsQuery,
} = botProfilesApi;
