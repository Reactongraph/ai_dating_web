import { Chat, ChatUser, QuickSuggestion } from '@/types/chat';

export const mockChatUsers: ChatUser[] = [
  {
    id: '1',
    name: 'Valentina Morelli',
    age: 26,
    avatar: '/assets/models/girl1.jpg',
    isLimitedEdition: true,
    isOnline: true,
    stats: {
      messages: '65K',
      chats: '10.4k',
    },
    tags: ['Girlfriend', '+7'],
    description: 'Fluent in temptation, and always one thought ahead.',
    details: {
      age: 26,
      occupation: 'Model',
      gender: 'Female',
      ethnicity: 'Caucasian',
      bodyType: 'Voluptuous',
      relationship: 'Girlfriend',
      personality: 'Temptress',
      hobby: 'Anime and Netflix',
    },
  },
  {
    id: '2',
    name: 'Tina',
    age: 24,
    avatar: '/assets/models/girl2.jpg',
    isLimitedEdition: false,
    isOnline: false,
    stats: {
      messages: '42K',
      chats: '8.2k',
    },
    tags: ['Friend', '+3'],
    description: 'Sweet and caring, always ready for deep conversations.',
    details: {
      age: 24,
      occupation: 'Teacher',
      gender: 'Female',
      ethnicity: 'Asian',
      bodyType: 'Slim',
      relationship: 'Friend',
      personality: 'Caregiver',
      hobby: 'Reading and Music',
    },
  },
  {
    id: '3',
    name: 'Farah',
    age: 25,
    avatar: '/assets/models/girl3.jpg',
    isLimitedEdition: false,
    isOnline: true,
    stats: {
      messages: '38K',
      chats: '6.8k',
    },
    tags: ['Bestfriend', '+5'],
    description: 'Adventurous spirit with a love for exploring new places.',
    details: {
      age: 25,
      occupation: 'Artist',
      gender: 'Female',
      ethnicity: 'Latina',
      bodyType: 'Athletic',
      relationship: 'Bestfriend',
      personality: 'Jester',
      hobby: 'Travel and Photography',
    },
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    user: mockChatUsers[0],
    lastMessage: 'Lorem ipsum dolor sit amet consecte...',
    timestamp: '15:53',
    unreadCount: 2,
    channelName: 'chat-1',
    messages: [
      {
        id: '1',
        senderId: '1',
        content:
          "Hi there... I'm Valentina, I saw you online and couldn't pass by...",
        timestamp: '15:53',
        isUser: false,
      },
    ],
  },
  {
    id: '2',
    user: mockChatUsers[1],
    lastMessage: 'Lorem ipsum dolor sit amet consecte...',
    timestamp: '14:01',
    unreadCount: 0,
    channelName: 'chat-2',
    messages: [
      {
        id: '2',
        senderId: '2',
        content: 'Hey! How was your day?',
        timestamp: '14:01',
        isUser: false,
      },
    ],
  },
  {
    id: '3',
    user: mockChatUsers[2],
    lastMessage: 'Lorem ipsum dolor sit amet consecte...',
    timestamp: '12:00',
    unreadCount: 1,
    channelName: 'chat-3',
    messages: [
      {
        id: '3',
        senderId: '3',
        content: 'Want to hear about my latest adventure?',
        timestamp: '12:00',
        isUser: false,
      },
    ],
  },
];

export const quickSuggestions: QuickSuggestion[] = [
  { id: '1', text: 'Continue' },
  { id: '2', text: "You're the kind of beautiful that's hard to ignore" },
  { id: '3', text: "That smile is a distraction I don't mind at all." },
];

export const privacyMessage =
  'All conversations are secure and completely confidential — your privacy matters.';
