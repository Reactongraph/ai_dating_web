import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// API Response Types
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
    s3Location?: string;
    path?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ChatListItem {
  chatId: string;
  botId: string;
  botName: string;
  botImageURL: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  channelName: string;
  createdAt: string;
  botProfile: BotProfile;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ChatListResponse {
  statusCode: number;
  data: {
    chats: ChatListItem[];
    pagination: PaginationInfo;
  };
}

export interface ChatListParams {
  page?: number;
  limit?: number;
}

// Chat Initiation Types
export interface UserBotReference {
  _id: string;
  userId: string;
  botId: string;
  chatId: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export interface ChatInitiateResponse {
  statusCode: number; // 201 for new chat, 200 for existing chat
  message: string;
  data: {
    chatId: string;
    botId: string;
    botName: string;
    botImageURL: string;
    channelName: string;
    isNewConnection: boolean; // true for new chat, false for existing chat
    botProfile: BotProfile;
    userBotReference: UserBotReference;
    botProfileSource: string;
  };
}

// Chat Message Types
export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isUser: boolean;
  type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO';
  unreadCount?: number;
}

// API Message Format for chat-with-bot history
export interface ChatWithBotHistoryMessage {
  human_message: string;
  ai_message: string;
}

export interface ChatWithBotRequest {
  question: string;
  chat_history: ChatWithBotHistoryMessage[];
  bot_profile_id: string;
  user_id: string;
}

export interface ChatWithBotImageResponse {
  imageURL: string;
  id: string;
}

export interface ChatWithBotResponse {
  success: boolean;
  message: string;
  data: {
    answer: string;
    image?: ChatWithBotImageResponse;
  };
}

export interface SendMessageRequest {
  type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO';
  unreadCount: number;
  channelName: string;
  lastMessage: string;
  message?: string; // The actual message content
}

export interface SendMessageResponse {
  statusCode: number;
  message: string;
  data: {
    messageId: string;
    timestamp: string;
    success: boolean;
  };
}

export interface MarkAsReadResponse {
  statusCode: number;
  message: string;
  success: boolean;
}

// Chat History Types
export interface ChatHistoryMetadata {
  imageUrl?: string;
  [key: string]: unknown;
}

export interface ChatHistoryMessage {
  chatId: string;
  channelName: string;
  senderId: string;
  receiverId: string;
  message: string;
  type: 'TEXT' | 'IMAGE' | 'AUDIO' | 'VIDEO' | 'TEXTANDIMAGE';
  messageType: 'USER' | 'BOT';
  timestamp: string;
  metadata?: ChatHistoryMetadata;
}

export interface ChatHistoryPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
}

export interface ChatHistoryResponse {
  success: boolean;
  data: {
    messages: ChatHistoryMessage[];
    pagination: ChatHistoryPagination;
  };
}

export interface ChatHistoryParams {
  channelName: string;
  page?: number;
  limit?: number;
  chatId?: string; // Optional chatId to force refetch when switching chats
}

// Chat Suggestions Types
export type SuggestionContext = 'casual' | 'flirty' | 'greeting';

export interface ChatSuggestionsResponse {
  statusCode: number;
  message: string;
  data: {
    botId: string;
    botName: string;
    context: SuggestionContext;
    suggestions: string[];
  };
}

export interface ChatSuggestionsParams {
  botId: string;
  context: SuggestionContext;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as { auth: { token: string | null } };
      const token = state.auth.token;

      console.log('Chat API - Token:', token);
      console.log('Chat API - State:', state);

      if (token) {
        headers.set('authorization', `Bearer ${token}`);
        console.log('Chat API - Authorization header set');
      } else {
        console.log('Chat API - No token found');
      }

      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['ChatList', 'ChatHistory'],
  endpoints: (builder) => ({
    getChatList: builder.query<ChatListResponse, ChatListParams>({
      query: ({ page = 1, limit = 20 }) => ({
        url: '/bot-chat/list',
        params: { page, limit },
      }),
      providesTags: ['ChatList'],
    }),
    initiateChat: builder.mutation<ChatInitiateResponse, string>({
      query: (botId) => ({
        url: `/bot-chat/initiate/${botId}`,
        method: 'POST',
      }),
      invalidatesTags: ['ChatList'], // Refresh chat list after initiating new chat
    }),
    chatWithBot: builder.mutation<ChatWithBotResponse, ChatWithBotRequest>({
      query: (requestData) => ({
        url: '/botProfiles/chat-with-bot',
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['ChatHistory'], // Invalidate chat history when sending messages
    }),
    sendMessage: builder.mutation<
      SendMessageResponse,
      { botId: string; messageData: SendMessageRequest }
    >({
      query: ({ botId, messageData }) => ({
        url: `/chat/${botId}`,
        method: 'POST',
        body: messageData,
      }),
      invalidatesTags: ['ChatList', 'ChatHistory'], // Refresh chat list and history
    }),
    markMessagesAsRead: builder.mutation<MarkAsReadResponse, string>({
      query: (channelName) => ({
        url: `/chat/messageRead/${channelName}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['ChatList'], // Refresh chat list to update unread counts
    }),
    getChatHistory: builder.query<ChatHistoryResponse, ChatHistoryParams>({
      query: ({ channelName, page = 1, limit = 50 }) => ({
        url: `/chat/history/${channelName}`,
        params: { page, limit },
      }),
      providesTags: (result, error, arg) => [
        { type: 'ChatHistory', id: arg.channelName },
      ],
    }),
    getChatSuggestions: builder.query<
      ChatSuggestionsResponse,
      ChatSuggestionsParams
    >({
      query: ({ botId, context }) => ({
        url: `/bot-chat/suggestions/${botId}`,
        params: { context },
      }),
    }),
  }),
});

export const {
  useGetChatListQuery,
  useInitiateChatMutation,
  useChatWithBotMutation,
  useSendMessageMutation,
  useMarkMessagesAsReadMutation,
  useGetChatHistoryQuery,
  useGetChatSuggestionsQuery,
} = chatApi;
