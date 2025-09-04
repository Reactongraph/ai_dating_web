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
}

export interface QuickSuggestion {
  id: string;
  text: string;
}
