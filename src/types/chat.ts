import { BotProfile } from '@/redux/services/chatApi';

export interface ChatUser {
  id: string;
  name: string;
  age: number;
  avatar: string;
  isLimitedEdition?: boolean;
  isOnline?: boolean;
  stats: {
    messages: string;
    chats: string;
  };
  tags: string[];
  description: string;
  details: {
    age: number;
    occupation: string;
    gender: string;
    ethnicity: string;
    bodyType: string;
    relationship: string;
    personality: string;
    hobby: string;
  };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isUser: boolean;
}

export interface Chat {
  id: string;
  user: ChatUser;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  messages: ChatMessage[];
  channelName: string;
  generatedImages?: GeneratedImagesData;
}

// Generated Image Types
export interface GeneratedImage {
  id: string;
  imageURL: string;
  prompt: string;
  context: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GeneratedImagesData {
  images: GeneratedImage[];
  totalCount: number;
  hasMore: boolean;
  primaryImage: string | null;
}

// API Response Types for Chat List
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
  generatedImages: GeneratedImagesData;
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

export interface QuickSuggestion {
  id: string;
  text: string;
}
